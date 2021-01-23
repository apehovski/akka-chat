package org.chat.user

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import org.chat.chatroom.ChatRoomActor.MessageAdded
import org.chat.ws.WsActor.{WSStatsUpdated, WSUserConnected, WSUserDisconnected}

object UserActor {
  def props(username: String, chatRoom: ActorRef) = Props(new UserActor(username, chatRoom))
}

class UserActor(username: String, chatRoom: ActorRef) extends Actor with ActorLogging {
  var wsActor = None: Option[ActorRef]

  def receive = {

    //send notifications via websocket to specific user
    case MessageAdded(body) =>
      wsActor.map(_ ! body)

    case WSStatsUpdated(body) =>
      wsActor.map(_ ! body)

    case WSUserConnected(_, newWsActor) =>
      wsActor = Some(newWsActor)

    case WSUserDisconnected(_) =>
      wsActor = None

  }

}
