package org.chat.chatroom

import akka.actor.{Actor, ActorLogging, ActorRef, ActorSystem, Props}
import org.chat.chatroom.ChatRoomActor._
import org.chat.stats.StatsActor
import org.chat.ws.WsActor.{WSUserConnected, WSUserDisconnected}

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
  final case class MessageAdded(msg: ChatMessage)

  final case class LoadRoomHistory(limit: Int = 50)
  final case class LoadRoomHistoryResp(history: immutable.Seq[ChatMessage])

  final case class ChatMessage(username: String, text: String,
                               datetime: String = currDateTime())

  def currDateTime(): String = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss"))
}

class ChatRoomActor(implicit system: ActorSystem, executionContext: ExecutionContextExecutor)
  extends Actor with ActorLogging {

  val roomUsers = new mutable.HashMap[String, ActorRef]
  val roomHistory = new mutable.MutableList[ChatMessage]

  val statsActor: ActorRef = system.actorOf(StatsActor.props(), "statsActor")


  def receive = {

    case AddUser(username, newUser) =>
      roomUsers += (username -> newUser)

    case RemoveUser(username) =>
      roomUsers -= username

    case MessageToRoom(username, text) =>
      log.info("MessageToRoom from " + username + " with text: " + text)
      val newMessage = ChatMessage(username, text)
      roomHistory += newMessage
      roomUsers.foreach(userEntry =>
        userEntry._2 ! MessageAdded(newMessage)
      )
      statsActor ! MessageAdded(newMessage)

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

  }

}
