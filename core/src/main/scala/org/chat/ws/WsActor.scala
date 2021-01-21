package org.chat.ws

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.stream.Materializer
import akka.stream.scaladsl.{Sink, SourceQueue}
import org.chat.chatroom.ChatRoomActor.ChatMessage
import org.chat.ws.WsActor._
import spray.json._

object WsActor {
  def props(wsOutputQueue: SourceQueue[Message], generalRoomActor: ActorRef)(implicit materializer: Materializer) =
    Props(new WsActor(wsOutputQueue, generalRoomActor))

  sealed trait WsInternal
  final case class WSDisconnected() extends WsInternal
  final case class WSUserConnected(username: String, wsActor: ActorRef)
  final case class WSUserDisconnected(username: Option[String])

  sealed trait WsExternal
  final case class WSLogin(username: String) extends WsExternal
}

trait WsActorProtocol extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val wsLoginFormat = jsonFormat1(WSLogin)
  implicit val chatMessageFormat = jsonFormat3(ChatMessage)
}

class WsActor(wsOutputQueue: SourceQueue[Message], generalRoomActor: ActorRef)(implicit materializer: Materializer)
  extends Actor with ActorLogging with WsActorProtocol {

  var username = None: Option[String]

  def receive = {
    case tm: TextMessage =>
      log.info("In WS: " + tm)
      if (username.isEmpty) {
        tm.textStream
          .map(json => json.parseJson.convertTo[WSLogin].username)
          .map(nick => {
            username = Some(nick)
            generalRoomActor ! WSUserConnected(nick, self)
          })
          .runWith(Sink.ignore)
      }

    case out: ChatMessage =>
      val outMessage = out.toJson.compactPrint
      log.info("Out WS: " + outMessage)
      wsOutputQueue.offer(TextMessage(outMessage))

    case WSDisconnected() =>
      generalRoomActor ! WSUserDisconnected(username)
      username = None

    case any =>
      log.error("Unknown message received: " + any)

  }

}
