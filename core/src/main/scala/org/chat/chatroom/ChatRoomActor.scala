package org.chat.chatroom

import akka.actor.{Actor, ActorLogging, ActorRef, ActorSystem, Props}
import org.chat.RunApp.kafkaEnabled
import org.chat.chatroom.ChatRoomActor._
import org.chat.stats.StatsActor
import org.chat.stats.StatsActor.{OutcomingKafka, Stats}
import org.chat.ws.WsActor.{OutcomingWS, WSStatsUpdated, WSUserConnected, WSUserDisconnected, WsSerializable}

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import scala.collection.{immutable, mutable}
import scala.concurrent.ExecutionContextExecutor

object ChatRoomActor {
  def props()(implicit system: ActorSystem, executionContext: ExecutionContextExecutor) =
    Props(new ChatRoomActor)

  final case class AddUser(username: String, newUser: ActorRef)
  final case class RemoveUser(username: String)

  final case class MessageToRoom(username: String, text: String)
  final case class MessageAdded(msg: ChatMessage) extends OutcomingWS with OutcomingKafka

  final case class LoadRoomHistory(limit: Int = 50)
  final case class LoadRoomHistoryResp(history: immutable.Seq[ChatMessage])

  final case class ChatMessage(username: String, text: String,
                               datetime: String = currDateTime()) extends WsSerializable

  def currDateTime(): String = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss.SSS"))
}

class ChatRoomActor(implicit system: ActorSystem, executionContext: ExecutionContextExecutor)
  extends Actor with ActorLogging {

  val roomUsers = new mutable.HashMap[String, ActorRef]
  val roomHistory = new mutable.MutableList[ChatMessage]

  val statsActor: Option[ActorRef] =
    if (kafkaEnabled()) Some(system.actorOf(StatsActor.props(), "statsActor"))
    else None


  def receive = {

    case AddUser(username, newUser) =>
      roomUsers += (username -> newUser)

    case RemoveUser(username) =>
      roomUsers -= username

    case MessageToRoom(username, text) =>
      log.info(s"MessageToRoom from $username: $text")
      val newMessage = ChatMessage(username, text)
      roomHistory += newMessage
      roomUsers.values.foreach(_ ! MessageAdded(newMessage))
      statsActor.map(_ ! MessageAdded(newMessage))

    case LoadRoomHistory(limit) =>
      val historySeq = immutable.Seq(roomHistory.takeRight(limit): _*)
      sender ! LoadRoomHistoryResp(historySeq)

    case wsConnect: WSUserConnected =>
      roomUsers.get(wsConnect.username)
        .foreach(_ ! wsConnect)

    case wsDisconnect: WSUserDisconnected =>
      wsDisconnect.username
        .map(nick =>
          roomUsers.get(nick)
            .foreach(_ ! wsDisconnect)
        )

    case stats: Stats => {
        roomUsers.values
          .foreach(_ ! WSStatsUpdated(stats))
      }

  }

}
