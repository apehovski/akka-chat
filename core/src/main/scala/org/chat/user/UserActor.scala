package org.chat.user

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import org.chat.chatroom.ChatRoomActor.MessageAdded
import org.chat.ws.WsActor.{WSUserConnected, WSUserDisconnected}

object UserActor {
  def props(username: String, chatRoom: ActorRef) = Props(new UserActor(username, chatRoom))
}

class UserActor(username: String, chatRoom: ActorRef) extends Actor with ActorLogging {
  var wsActor = None: Option[ActorRef]

  def receive = {

    case MessageAdded(msg) =>
      //send notification via websocket to specific user
      wsActor.map(_ ! msg)

    case WSUserConnected(_, newWsActor) =>
      wsActor = Some(newWsActor);

    case WSUserDisconnected(_) =>
      wsActor = None;

  }

}
