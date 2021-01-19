package org.chat.chatroom

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import akka.util.Timeout
import org.chat.chatroom.ChatRoomActor._
import org.chat.user.UserActor
import org.chat.user.UserActor.MessageAdded
import org.chat.ws.WsActor.{WSUserConnected, WSUserDisconnected}

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import scala.collection.{immutable, mutable}
import scala.concurrent.duration._

object ChatRoomActor {
  def props(): Props = Props(new ChatRoomActor)

  final case class AddUser(username: String, newUser: ActorRef)
  final case class RemoveUser(username: String)

  final case class MessageToRoom(username: String, text: String)
  final case class LoadUserHistory(username: String)

  final case class LoadRoomHistory(limit: Int = 50)
  final case class LoadRoomHistoryResp(history: immutable.Seq[ChatMessage])

  final case class ChatMessage(username: String, text: String,
                               datetime: String = currDateTime())

  def currDateTime(): String = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss"))
}

class ChatRoomActor extends Actor with ActorLogging {
  implicit val timeout: Timeout = 5.seconds

  val botNickname = "ChatBot"

  val roomUsers = new mutable.HashMap[String, ActorRef]
  val roomHistory = new mutable.MutableList[ChatMessage]


  def receive = {

    case AddUser(username, newUser) =>
      roomUsers += (username -> newUser)
      newUser ! MessageAdded(botNickname, "Welcome to the chat, buddy")

    case RemoveUser(username) =>
      roomUsers -= username

    case MessageToRoom(username, text) =>
      log.info("MessageToRoom from " + username + " with text: " + text)
      roomHistory += ChatMessage(username, text)
      roomUsers.foreach(userEntry =>
        userEntry._2 ! UserActor.MessageAdded(username, text)
      )

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
