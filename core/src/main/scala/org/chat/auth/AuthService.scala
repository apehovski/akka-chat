package org.chat.auth

import akka.actor.ActorRef
import akka.http.scaladsl.model.{ContentTypes, HttpEntity}
import akka.http.scaladsl.server.Directives.{complete, get, path, _}
import akka.util.Timeout
import org.chat.auth.AuthActor.Login

import scala.concurrent.ExecutionContext

class AuthService(authActor: ActorRef)(implicit executionContext: ExecutionContext, timeout: Timeout) {

  lazy val routes =
    path("login" / Segment) { username: String =>
      get {
        authActor ! Login(username)
        complete(HttpEntity(ContentTypes.`text/html(UTF-8)`, s"<h1>Now you are logged in, $username </h1>"))
      }
    }

}

