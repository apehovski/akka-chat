package org.chat

import akka.actor.{ActorRef, ActorSystem}
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.kafka.scaladsl.Consumer
import akka.kafka.{ConsumerSettings, Subscriptions}
import akka.stream.ActorMaterializer
import akka.stream.scaladsl.{Flow, Source}
import akka.util.Timeout
import ch.megard.akka.http.cors.scaladsl.CorsDirectives._
import com.typesafe.config.ConfigFactory
import org.apache.kafka.common.serialization.{LongDeserializer, StringDeserializer}
import org.chat.auth.{AuthActor, AuthService, ChatAuthenticator}
import org.chat.chatroom.{ChatRoomActor, ChatRoomService}
import org.chat.stats.StatsActor.Stats

import scala.concurrent.duration._

object RunApp extends App {
  implicit val system: ActorSystem = ActorSystem("chatActorSystem")

  val authRealm = "chat-realm"
  val conf = ConfigFactory.load

  implicit val materializer = ActorMaterializer()
  implicit val executionContext = system.dispatcher
  implicit val timeout: Timeout = 5.seconds

  private val generalRoom: ActorRef = system.actorOf(ChatRoomActor.props(), "generalRoomActor")
  private val authActor: ActorRef = system.actorOf(AuthActor.props(generalRoom), "authActor")
  private val chatAuth = new ChatAuthenticator(authActor)

  val route = Route.seal {
    cors() {
      pathPrefix("api") {
        concat(
          path("ping") {
            get { complete(HttpEntity("pong")) }
          },
          path("pingWS") {
            handleWebSocketMessages(pingWSHandler)
          },
          new AuthService(authActor, chatAuth).routes,
          new ChatRoomService(generalRoom, chatAuth).routes
        )
      }
    }
  }

  def pingWSHandler: Flow[Message, Message, Any] =
    Flow[Message].mapConcat {
      case tm: TextMessage =>
        TextMessage(Source.single("pong: ") ++ tm.textStream) :: Nil
    }

  def kafkaEnabled(): Boolean =
    sys.env.get("KAFKA_HOST").isDefined //only if env var provided

  if (kafkaEnabled()) {
    val consumerSettings =
      ConsumerSettings(system, new StringDeserializer, new LongDeserializer)
    val topicFrom = conf.getString("chat.topic.stats")
    //other settings - application.conf "akka.kafka.consumer"

    Consumer
      .plainSource(consumerSettings, Subscriptions.topics(topicFrom))
      .map { incoming =>
        println(s"Incoming from $topicFrom: $incoming")
        Stats(incoming.key(), incoming.value())
      }
      .runForeach(stats => generalRoom ! stats)
  }

  Http().bindAndHandle(route, "0.0.0.0", 8080).map { _ =>
    println(s"Server started at http://0.0.0.0:8080/")
  }
  sys.addShutdownHook(system.terminate())

}
