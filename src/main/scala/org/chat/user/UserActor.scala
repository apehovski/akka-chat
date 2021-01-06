package org.chat.user

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import org.chat.chatroom.ChatRoomActor.MessageToRoom
import org.chat.user.UserActor._

object UserActor {
  def props(username: String, chatRoom: ActorRef): Props = Props(new UserActor(username, chatRoom))

  final case class SendMessageToRoom(msg: String)
  final case class MessageAdded(username: String, msg: String)
}

class UserActor(username: String, chatRoom: ActorRef) extends Actor with ActorLogging {

  def receive = {
    case SendMessageToRoom(msgText) =>
      log.info("Send message: " + msgText)
      chatRoom ! MessageToRoom(username, msgText)

//    case MessageAdded(username, msgText) => ???
    //TODO send message/notification via websocket to specific user

  }

}
