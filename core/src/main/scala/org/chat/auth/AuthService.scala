package org.chat.auth

import akka.actor.ActorRef
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.server.Directives.{complete, path, _}
import akka.pattern.ask
import akka.util.Timeout
import org.chat.RunApp.{authRealm, chatAuthenticator}
import org.chat.auth.AuthActor.{Login, LoginResp, Logout, LogoutResp}
import spray.json.DefaultJsonProtocol

import scala.concurrent.ExecutionContext

trait AuthServiceProtocol extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val loginReqFormat = jsonFormat1(Login)
  implicit val loginRespFormat = jsonFormat2(LoginResp)

  implicit val logoutReqFormat = jsonFormat1(Logout)
  implicit val logoutRespFormat = jsonFormat2(LogoutResp)
}

class AuthService(authActor: ActorRef)(implicit executionContext: ExecutionContext, timeout: Timeout)
  extends AuthServiceProtocol {

  lazy val routes = {
    concat(
      path("login") {
        post {
          entity(as[Login]) { req =>
            complete {
              (authActor ? req).mapTo[LoginResp]
            }
          }
        }
      },

      path("logout") {
        authenticateBasicAsync(authRealm, chatAuthenticator) { username =>
          post {
            complete {
              (authActor ? Logout(username)).mapTo[LogoutResp]
            }
          }
        }
      }
    )
  }

}

