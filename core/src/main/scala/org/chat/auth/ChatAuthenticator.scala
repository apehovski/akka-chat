package org.chat.auth

import akka.actor.ActorRef
import akka.http.scaladsl.server.directives.Credentials
import org.chat.auth.AuthActor.IsActive
import akka.pattern.ask
import akka.util.Timeout

import scala.concurrent.{ExecutionContext, Future}

class ChatAuthenticator(authActor: ActorRef)(implicit timeout: Timeout, ec: ExecutionContext) {

  def check(credentials: Credentials): Future[Option[String]] =
    credentials match {
      case c@Credentials.Provided(username)
        if c.verify(username) => //username equals password
        (authActor ? IsActive(username))
          .mapTo[Boolean]
          .map(isActive => if (isActive) Some(username) else None)

      case _ => Future.successful(None)
    }

}
