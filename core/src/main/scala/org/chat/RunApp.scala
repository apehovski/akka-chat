package org.chat

import akka.actor.{ActorRef, ActorSystem}
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.HttpEntity
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.http.scaladsl.server.directives.Credentials
import akka.pattern.ask
import akka.stream.ActorMaterializer
import akka.util.Timeout
import org.chat.auth.AuthActor.IsActive
import org.chat.auth.{AuthActor, AuthService}
import org.chat.chatroom.{ChatRoomActor, ChatRoomService}

import scala.concurrent.Future
import scala.concurrent.duration._

object RunApp extends App {
  implicit val system: ActorSystem = ActorSystem("chatActorSystem")
  sys.addShutdownHook(system.terminate())

  val authRealm = "chat-realm";

  implicit val materializer = ActorMaterializer()
  implicit val executionContext = system.dispatcher
  implicit val timeout: Timeout = 5.seconds

  private val generalRoom: ActorRef = system.actorOf(ChatRoomActor.props(), "generalRoomActor")
  private val authActor: ActorRef = system.actorOf(AuthActor.props(generalRoom), "authActor")

  val route = Route.seal {
    pathPrefix("api") {
      concat(
        path("ping") {
          get { complete(HttpEntity("pong")) }
        },
        new AuthService(authActor).routes,
        new ChatRoomService(generalRoom).routes
      )
    }
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

  Http().bindAndHandle(route, "0.0.0.0", 8080)
  println(s"Server started at http://0.0.0.0:8080/")

}
