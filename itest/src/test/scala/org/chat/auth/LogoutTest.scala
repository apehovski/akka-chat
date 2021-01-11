package org.chat.auth

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import org.chat.auth.LoginTest.doLoginUser1
import org.chat.config.Common.{baseURL, httpConf, userName1}
import org.chat.config.Routes.{logout, roomHistory}

class LogoutTest extends Simulation {

  val scn = scenario("Logout endpoint")
    .exec(doLoginUser1("Perform login first")
      .check(regex("Now you are logged in").exists))

    .exec(http("Check protected resource with logged in user")
      .get(s"$baseURL/$roomHistory")
      .basicAuth(userName1, userName1)
      .check(status.is(200))
      .check(jsonPath("$.history").is("[]")))

    .exec(http("Perform logout")
      .get(s"$baseURL/$logout")
      .basicAuth(userName1, userName1)
      .check(status.is(200)))

    .exec(http("Check protected resource with logged out user")
      .get(s"$baseURL/$roomHistory")
      .basicAuth(userName1, userName1)
      .check(status.is(401)))


  setUp(scn.inject(atOnceUsers(1)))
    .protocols(httpConf)

}
