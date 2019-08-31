package org.chat.actors.user

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import org.chat.actors.chatroom.ChatRoomActor.MessageToRoom
import org.chat.actors.user.UserActor._

import scala.collection.{immutable, mutable}

object UserActor {
  def props(username: String, chatRoom: ActorRef): Props = Props(new UserActor(username, chatRoom))

  final case class SendMessageToRoom(msg: String)
  final case class MessageAdded(username: String, msg: String)

  final case class LoadHistory(limit: Int = 10)
  final case class LoadHistoryResp(history: immutable.Seq[(String, String)])
}

class UserActor(username: String, chatRoom: ActorRef) extends Actor with ActorLogging {

  val userHistory = new mutable.MutableList[(String, String)]

  def receive = {
    case SendMessageToRoom(msgText) =>
      log.info("Send message: " + msgText)
      chatRoom ! MessageToRoom(username, msgText)

    case MessageAdded(username, msgText) =>
      userHistory += ((username, msgText))

    case LoadHistory(limit) =>
      val historySeq = immutable.Seq(userHistory.takeRight(limit): _*)
      sender() ! LoadHistoryResp(historySeq)

  }

}
