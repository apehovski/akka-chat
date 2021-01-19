package org.chat.user

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import org.chat.user.UserActor._
import org.chat.ws.WsActor.{WSOutputMessage, WSUserConnected, WSUserDisconnected}

object UserActor {
  def props(username: String, chatRoom: ActorRef): Props = Props(new UserActor(username, chatRoom))

  final case class MessageAdded(username: String, text: String)
}

class UserActor(username: String, chatRoom: ActorRef) extends Actor with ActorLogging {
  var wsActor = None: Option[ActorRef]

  def receive = {

    case MessageAdded(fromUser, text) =>
      //send notification via websocket to specific user
      wsActor.map(_ ! WSOutputMessage(fromUser, text))

    case WSUserConnected(_, newWsActor) =>
      wsActor = Some(newWsActor);

    case WSUserDisconnected(_) =>
      wsActor = None;

  }

}
