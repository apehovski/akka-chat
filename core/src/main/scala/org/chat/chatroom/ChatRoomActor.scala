package org.chat.chatroom

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import akka.util.Timeout
import org.chat.chatroom.ChatRoomActor._
import org.chat.user.UserActor
import org.chat.user.UserActor.MessageAdded

import scala.collection.{immutable, mutable}
import scala.concurrent.duration._

object ChatRoomActor {
  def props(): Props = Props(new ChatRoomActor)

  final case class AddUser(username: String, newUser: ActorRef)
  final case class RemoveUser(username: String)

  final case class MessageToRoom(username: String, text: String)
  final case class LoadUserHistory(username: String)

  final case class LoadRoomHistory(limit: Int = 50)
  final case class LoadRoomHistoryResp(history: immutable.Seq[(String, String)])
}

class ChatRoomActor extends Actor with ActorLogging {
  implicit val timeout: Timeout = 5.seconds

  val botNickname = "ChatBot"

  val roomUsers = new mutable.HashMap[String, ActorRef]
  val roomHistory = new mutable.MutableList[(String, String)]


  def receive = {

    case AddUser(username, newUser) =>
      roomUsers += (username -> newUser)
      newUser ! MessageAdded(botNickname, "Welcome to the chat, buddy")

    case RemoveUser(username) =>
      roomUsers -= username

    case MessageToRoom(username, text) =>
      log.info("MessageToRoom (from " + sender() + "): " + username + " with text: " + text)
      roomHistory += ((username, text))
      roomUsers.foreach(userEntry =>
        userEntry._2 ! UserActor.MessageAdded(username, text)
      )

    case LoadRoomHistory(limit) =>
      val historySeq = immutable.Seq(roomHistory.takeRight(limit): _*)
      sender ! LoadRoomHistoryResp(historySeq)

  }

}
