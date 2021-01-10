package org.chat.auth

import akka.actor.{Actor, ActorLogging, ActorRef, Props}
import org.chat.auth.AuthActor.{IsActive, Login, Logout}
import org.chat.chatroom.ChatRoomActor.{AddUser, RemoveUser}
import org.chat.user.UserActor

object AuthActor {
  def props(generalRoom: ActorRef): Props = Props(new AuthActor(generalRoom))

  final case class Login(username: String)
  final case class Logout(username: String)
  final case class IsActive(username: String)
  final case class SessionExpired(username: String) //from TTL
}

class AuthActor(generalRoom: ActorRef) extends Actor with ActorLogging {

  var users = Map.empty[String, ActorRef]

  def receive: Receive = {

    case Login(username) =>
      log.info("Login (from " + sender() + "): " + username)
      val user = context.actorOf(UserActor.props(username, self))
      users += (username -> user)
      generalRoom ! AddUser(username, user)

    case Logout(username) =>
      log.info("Logout (from " + sender() + "): " + username)
      users.get(username)
        .foreach(userActor => context.stop(userActor))
      users -= username
      generalRoom ! RemoveUser(username)

    case IsActive(username) =>
      sender ! users.contains(username)

  }

}