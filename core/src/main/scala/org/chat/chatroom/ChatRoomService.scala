package org.chat.chatroom

import akka.actor.ActorRef
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives.{as, complete, concat, entity, get, path, post}
import akka.pattern.ask
import akka.util.Timeout
import org.chat.RunApp.generalRoom
import org.chat.chatroom.ChatRoomActor.{LoadRoomHistory, LoadRoomHistoryResp, MessageToRoom}
import spray.json.{DefaultJsonProtocol, JsValue}

import scala.concurrent.ExecutionContext

trait ChatRoomProtocol extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val loadRoomHistoryRespFormat = jsonFormat1(LoadRoomHistoryResp)
  implicit val sendMsgFormat = jsonFormat2(MessageToRoom)
}

class ChatRoomService (chatRoomActor: ActorRef)(implicit executionContext: ExecutionContext, timeout: Timeout)
  extends ChatRoomProtocol {

  def routes(username: String) =
    concat(
      path("history") {
        get {
          complete {
            (generalRoom ? LoadRoomHistory()).mapTo[LoadRoomHistoryResp]
          }
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


}
