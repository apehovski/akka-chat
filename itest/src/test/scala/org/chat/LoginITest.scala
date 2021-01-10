package org.chat

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import org.chat.config.Common._
import org.chat.config.Routes.{login, roomHistory}

class LoginITest extends Simulation {

  val userName = "gatling_user"

  val scn = scenario("Login endpoint")
    .exec(http("Check protected resource without auth")
        .get(s"$baseURL/$roomHistory")
        .check(status.is(401)))

    .exec(http("Check protected resource with non-existing user")
        .get(s"$baseURL/$roomHistory")
        .basicAuth("unknown_user", "unknown_password")
        .check(status.is(401)))

    .exec(http("Perform login")
        .get(s"$baseURL/$login/$userName")
        .check(status.is(200))
        .check(regex("Now you are logged in").exists))

    .exec(http("Check protected resource with logged in user")
      .get(s"$baseURL/$roomHistory")
      .basicAuth(userName, userName)
      .check(status.is(200))
      .check(jsonPath("$.history").is("[]")))

  setUp(scn.inject(atOnceUsers(1)))
    .protocols(httpConf)

}
