package org.chat.ws

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.model.ws.{Message, TextMessage}
import akka.stream.Materializer
import akka.stream.scaladsl.{Sink, SourceQueue}
import org.chat.chatroom.ChatRoomActor.{ChatMessage, MessageAdded}
import org.chat.stats.StatsActor.Stats
import org.chat.ws.WsActor._
import spray.json._

import scala.collection.immutable


object WsActor {
  def props(wsOutputQueue: SourceQueue[Message], generalRoomActor: ActorRef)(implicit materializer: Materializer) =
    Props(new WsActor(wsOutputQueue, generalRoomActor))

  sealed trait WsInternal
  final case class WSDisconnected() extends WsInternal
  final case class WSUserConnected(username: String, wsActor: ActorRef)
  final case class WSUserDisconnected(username: Option[String])

  sealed trait WsExternal //marker for actor protocol
  trait IncomingWS extends WsExternal
  trait OutcomingWS extends WsExternal

  final case class WSLogin(username: String) extends IncomingWS
  final case class WSChatMessage(msg: ChatMessage, `type`: String = "chat-message") extends OutcomingWS
  final case class WSFullStats(full: immutable.Seq[Stats], `type`: String = "full-stats") extends OutcomingWS
  final case class WSStatsUpdate(update: Stats, `type`: String = "stats-update") extends OutcomingWS
}

trait WsActorProtocol extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val wsLoginFormat = jsonFormat1(WSLogin)

  implicit val chatMessageFormat = jsonFormat3(ChatMessage)
  implicit val wsChatMessageFormat = jsonFormat2(WSChatMessage)

  implicit val statsFormat = jsonFormat2(Stats)
  implicit val fullStatsFormat = jsonFormat2(WSFullStats)
  implicit val statsUpdateFormat = jsonFormat2(WSStatsUpdate)
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

    case toSend: OutcomingWS =>
      val out = toSend match {
        case m: MessageAdded => WSChatMessage(m.msg).toJson.compactPrint
        case f: WSFullStats => f.toJson.compactPrint
        case u: WSStatsUpdate => u.toJson.compactPrint
      }
      log.info(s"Out WS: $out")
      wsOutputQueue.offer(TextMessage(out))

    case WSDisconnected() =>
      generalRoomActor ! WSUserDisconnected(username)
      username = None

    case any =>
      log.error("Unknown message received: " + any)

  }

}
