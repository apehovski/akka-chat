package org.chat.auth

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.http.request.builder.HttpRequestBuilder
import org.chat.config.Common
import org.chat.config.Common._
import org.chat.config.Routes.{login, roomHistory}
import org.chat.auth.LoginTest.doLoginUser1

object LoginTest {
  def doLoginUser1: String => HttpRequestBuilder =
    LoginTest.doLogin(Common.userName1)

  def doLogin(userNickName: UserNameType)(reqName: String) =
    http(reqName)
      .get(s"$baseURL/$login/$userNickName")
      .check(status.is(200))
}

class LoginTest extends Simulation {

  val scn = scenario("Login endpoint")
    .exec(http("Check protected resource without auth")
        .get(s"$baseURL/$roomHistory")
        .check(status.is(401)))

    .exec(http("Check protected resource with non-existing user")
        .get(s"$baseURL/$roomHistory")
        .basicAuth("unknown_user", "unknown_password")
        .check(status.is(401)))

    .exec(doLoginUser1("Perform login")
      .check(regex("Now you are logged in").exists))

    .exec(http("Check protected resource with logged in user")
      .get(s"$baseURL/$roomHistory")
      .basicAuth(userName1, userName1)
      .check(status.is(200))
      .check(jsonPath("$.history").is("[]")))

  setUp(scn.inject(atOnceUsers(1)))
    .protocols(httpConf)

}
