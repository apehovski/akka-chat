package org.chat.chatroom

import akka.actor.{ActorRef, ActorSystem}
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.ws.Message
import akka.http.scaladsl.server.Directives.{as, authenticateBasicAsync, complete, concat, entity, get, handleWebSocketMessages, path, post}
import akka.pattern.ask
import akka.stream.scaladsl.{Flow, Sink, Source}
import akka.stream.{ActorMaterializer, OverflowStrategy}
import akka.util.Timeout
import org.chat.RunApp.{authRealm, chatAuthenticator}
import org.chat.chatroom.ChatRoomActor.{LoadRoomHistory, LoadRoomHistoryResp, MessageToRoom}
import org.chat.chatroom.ChatRoomService.counter
import org.chat.ws.WsActor
import org.chat.ws.WsActor.WSDisconnected
import spray.json.{DefaultJsonProtocol, JsValue}

import java.util.concurrent.atomic.AtomicInteger
import scala.concurrent.ExecutionContext

trait ChatRoomProtocol extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val loadRoomHistoryRespFormat = jsonFormat1(LoadRoomHistoryResp)
  implicit val sendMsgFormat = jsonFormat2(MessageToRoom)
  implicit val statusOkFormat = jsonFormat1(StatusOk)

  final case class StatusOk(status: String = "ok")
}

object ChatRoomService {
  val counter = new AtomicInteger(0);
}

class ChatRoomService(generalRoomActor: ActorRef)
                     (implicit executionContext: ExecutionContext, timeout: Timeout,
                      materializer: ActorMaterializer, system: ActorSystem)
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
              complete(StatusOk())
            }
          }
        }
      },

      path("wsConnection") {
        handleWebSocketMessages(wsFlow)
      }
    )


  def wsFlow(): Flow[Message, Message, Any] = {
    val (outputQueue, output) = Source.queue[Message](10, OverflowStrategy.fail).preMaterialize()

    val inputActor = system.actorOf(WsActor.props(outputQueue, generalRoomActor), "wsActor-" + counter.incrementAndGet())
    val (_, input) = Sink.actorRef(inputActor, WSDisconnected()).preMaterialize();

    Flow.fromSinkAndSource(input, output)
  }

}
