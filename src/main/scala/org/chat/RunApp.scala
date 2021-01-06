package org.chat

import akka.actor.{ActorRef, ActorSystem}
import akka.http.scaladsl.Http
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.{ContentTypes, HttpEntity, StatusCodes}
import akka.http.scaladsl.server.Directives._
import akka.pattern.ask
import akka.stream.ActorMaterializer
import akka.util.Timeout
import org.chat.chatroom.ChatRoomActor
import org.chat.chatroom.ChatRoomActor.{LoadRoomHistoryResp, MessageToRoom}
import spray.json.DefaultJsonProtocol

import scala.concurrent.duration._

trait JsonSupport extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val loadRoomHistoryRespFormat = jsonFormat1(LoadRoomHistoryResp)
  implicit val sendMsgFormat = jsonFormat2(MessageToRoom)
}

object RunApp extends App with JsonSupport {
  implicit val system: ActorSystem = ActorSystem("chatRoomSystem")
  sys.addShutdownHook(system.terminate())

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
      path("history") {
        get {
          complete { (chatRoom ? ChatRoomActor.LoadRoomHistory()).mapTo[LoadRoomHistoryResp] }
        }
      },
      path("sendRoomMessage") {
        post {
          entity(as[MessageToRoom]) { request =>
            chatRoom ! request
            complete(StatusCodes.OK)
          }
        }
      }
    )

  Http().bindAndHandle(route, "localhost", 8080)
  println(s"Server started at http://localhost:8080/")

}
