package org.chat

import akka.actor.{ActorRef, ActorSystem}
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{ContentTypes, HttpEntity, StatusCodes}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.directives.Credentials
import akka.pattern.ask
import akka.stream.ActorMaterializer
import akka.util.Timeout
import org.chat.auth.AuthActor
import org.chat.auth.AuthActor.{IsActive, Login}
import org.chat.chatroom.ChatRoomActor
import org.chat.chatroom.ChatRoomActor.{LoadRoomHistory, LoadRoomHistoryResp, MessageToRoom}
import spray.json.{DefaultJsonProtocol, JsValue}

import scala.concurrent.Future
import scala.concurrent.duration._

trait JsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val loadRoomHistoryRespFormat = jsonFormat1(LoadRoomHistoryResp)
  implicit val sendMsgFormat = jsonFormat2(MessageToRoom)
}

object RunApp extends App with JsonSupport {
  implicit val system: ActorSystem = ActorSystem("chatActorSystem")
  sys.addShutdownHook(system.terminate())

  val authRealm = "secret";

  implicit val materializer = ActorMaterializer()
  implicit val executionContext = system.dispatcher
  implicit val timeout: Timeout = 5.seconds

  val generalRoom: ActorRef = system.actorOf(ChatRoomActor.props(), "generalRoomActor")
  val authActor: ActorRef = system.actorOf(AuthActor.props(generalRoom), "authActor")

  val route = Route.seal {
    concat(
      path("hello") {
        get {
          complete(HttpEntity(ContentTypes.`text/html(UTF-8)`, "<h1>Welcome to chat</h1>"))
        }
      },
      path("login" / Segment) { username : String =>
        get {
          authActor ! Login(username)
          complete(HttpEntity(ContentTypes.`text/html(UTF-8)`, s"<h1>Now you are logged in, $username </h1>"))
        }
      },

      authenticateBasicAsync(authRealm, chatAuthenticator) { username =>
        concat(
          path("history") {
            get {
              complete { (generalRoom ? LoadRoomHistory()).mapTo[LoadRoomHistoryResp] }
            }
          },

          path("sendRoomMessage") {
            post {
              entity(as[JsValue]) { json =>
                val msgText = json.asJsObject.fields("msgText").convertTo[String]
                generalRoom ! MessageToRoom(username, msgText)
                complete(StatusCodes.OK)
              }
            }
          }
        )
      },

    )
  }

  def chatAuthenticator(credentials: Credentials): Future[Option[String]] =
    credentials match {
      case c @ Credentials.Provided(username)
        if c.verify(username) => //username equals password
        (authActor ? IsActive(username))
            .mapTo[Boolean]
            .map(isActive => if (isActive) Some(username) else None)

      case _ => Future.successful(None)
    }

  Http().bindAndHandle(route, "localhost", 8080)
  println(s"Server started at http://localhost:8080/")

}
