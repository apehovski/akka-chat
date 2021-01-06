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

  final case class Login(username: String)
  final case class Logout(username: String)

  final case class MessageToRoom(username: String, msgText: String)
  final case class LoadUserHistory(username: String)

  final case class LoadRoomHistory(limit: Int = 50)
  final case class LoadRoomHistoryResp(history: immutable.Seq[(String, String)])
}

class ChatRoomActor extends Actor with ActorLogging {
  implicit val timeout: Timeout = 5.seconds

  val botNickname = "ChatBot"

  val users = new mutable.HashMap[String, ActorRef]
  val chatHistory = new mutable.MutableList[(String, String)]


  def receive = {
    case Login(username) =>
      log.info("Login (from " + sender() + "): " + username)
      val user = context.actorOf(UserActor.props(username, self))
      users += (username -> user)
      user ! MessageAdded(botNickname, "Welcome to the chat, buddy")

    case Logout(username) =>
      log.info("Logout (from " + sender() + "): " + username)
      users.remove(username)
        .foreach(userActor => context.stop(userActor))

    case MessageToRoom(username, msgText) =>
      log.info("MessageToRoom (from " + sender() + "): " + username + " with text: " + msgText)
      chatHistory += ((username, msgText))
      users.foreach(userEntry =>
        userEntry._2 ! UserActor.MessageAdded(username, msgText)
      )

    case LoadRoomHistory(limit) =>
      val historySeq = immutable.Seq(chatHistory.takeRight(limit): _*)
      sender ! LoadRoomHistoryResp(historySeq)

  }

}
