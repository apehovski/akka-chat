package org.chat

import akka.actor.{ActorRef, ActorSystem}
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{ContentTypes, HttpEntity, StatusCodes}
import akka.http.scaladsl.server.Directives._
import akka.pattern.ask
import akka.stream.ActorMaterializer
import akka.util.Timeout
import org.chat.actors.chatroom.ChatRoomActor
import org.chat.actors.user.UserActor.LoadHistoryResp
import spray.json.DefaultJsonProtocol

import scala.concurrent.duration._
import scala.io.StdIn
import scala.util.{Failure, Success}

trait JsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val loadHistoryRespFormat = jsonFormat1(LoadHistoryResp)
}

object RunApp extends App with JsonSupport {
  implicit val system: ActorSystem = ActorSystem("chatRoomSystem")
  implicit val materializer = ActorMaterializer()
  implicit val executionContext = system.dispatcher
  implicit val timeout: Timeout = 5.seconds

  val chatRoom: ActorRef = system.actorOf(ChatRoomActor.props(), "chatRoomActor")

  val route =
    concat(
      path("hello") {
        get {
          complete(HttpEntity(ContentTypes.`text/html(UTF-8)`, "<h1>Say hello to akka-http</h1>"))
        }
      },
      path("login" / Segment) { username : String =>
        get {
          chatRoom ! ChatRoomActor.Login(username)
          complete(HttpEntity(ContentTypes.`text/html(UTF-8)`, s"<h1>Now you are logged in, $username </h1>"))
        }
      },
      path("history" / Segment) { username : String =>
        get {
          val userHistoryF = (chatRoom ? ChatRoomActor.LoadUserHistory(username)).mapTo[LoadHistoryResp]
          onComplete(userHistoryF) {
            case Success(userHistory) =>
              complete(userHistory)

            case Failure(ex) =>
              complete(StatusCodes.InternalServerError, ex.getMessage)
          }
        }
      }
    )

  val bindingFuture = Http().bindAndHandle(route, "localhost", 8080)
  println(s"Server online at http://localhost:8080/\nPress RETURN to stop...")
  StdIn.readLine() // let it run until user presses return

  bindingFuture
    .flatMap(_.unbind())
    .onComplete(_ => system.terminate())

}
