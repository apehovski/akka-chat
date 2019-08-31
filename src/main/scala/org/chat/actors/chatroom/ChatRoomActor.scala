package org.chat.actors.chatroom

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import akka.pattern.{ask, pipe}
import akka.util.Timeout
import org.chat.actors.chatroom.ChatRoomActor._
import org.chat.actors.user.UserActor
import org.chat.actors.user.UserActor.MessageAdded

import scala.collection.mutable
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration._

object ChatRoomActor {
  def props(): Props = Props(new ChatRoomActor)

  final case class Login(username: String)
  final case class Logout(username: String)

  final case class MessageToRoom(username: String, msgText: String)
  final case class LoadUserHistory(username: String)
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

    case LoadUserHistory(username) =>
      users
          .find(userEntry => userEntry._1 == username)
          .map(userEntry => {
              userEntry._2 ? UserActor.LoadHistory() pipeTo sender()
          })

  }

}
