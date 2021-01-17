package org.chat.chatroom

import akka.actor.ActorRef
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Directives.{as, authenticateBasicAsync, complete, concat, entity, get, path, post}
import akka.pattern.ask
import akka.util.Timeout
import org.chat.RunApp.{authRealm, chatAuthenticator}
import org.chat.chatroom.ChatRoomActor.{LoadRoomHistory, LoadRoomHistoryResp, MessageToRoom}
import spray.json.{DefaultJsonProtocol, JsValue}

import scala.concurrent.ExecutionContext

trait ChatRoomProtocol extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val loadRoomHistoryRespFormat = jsonFormat1(LoadRoomHistoryResp)
  implicit val sendMsgFormat = jsonFormat2(MessageToRoom)
}

class ChatRoomService(generalRoomActor: ActorRef)(implicit executionContext: ExecutionContext, timeout: Timeout)
  extends ChatRoomProtocol {

  val routes =
    concat(
      path("roomHistory") {
        get {
          authenticateBasicAsync(authRealm, chatAuthenticator) { username =>
            complete {
              (generalRoomActor ? LoadRoomHistory()).mapTo[LoadRoomHistoryResp]
            }
          }
        }
      },

      path("sendRoomMessage") {
        post {
          authenticateBasicAsync(authRealm, chatAuthenticator) { username =>
            entity(as[JsValue]) { json =>
              val text = json.asJsObject.fields("text").convertTo[String]
              generalRoomActor ! MessageToRoom(username, text)
              complete(StatusCodes.OK)
            }
          }
        }
      }
    )


}
