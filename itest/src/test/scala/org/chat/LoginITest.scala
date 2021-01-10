package org.chat

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import org.chat.config.Common._

class LoginITest extends Simulation {

  val userName = "gatling_user"

  val scn = scenario("Login endpoint")
    .exec(http("Check protected resource without auth")
        .get(BASE_URL + "/history")
        .check(status.is(401)))

    .exec(http("Check protected resource with non-existing user")
        .get(BASE_URL + "/history")
        .basicAuth("unknown_user", "unknown_password")
        .check(status.is(401)))

    .exec(http("Perform login")
        .get(BASE_URL + "/login/" + userName)
        .header("Accept", "*/*")
        .check(status.is(200))
        .check(regex("Now you are logged in").exists))

    .exec(http("Check protected resource with non-existing user")
      .get(BASE_URL + "/history")
      .basicAuth(userName, userName)
      .check(status.is(200))
      .check(jsonPath("$.history").is("[]")))

  setUp(scn.inject(atOnceUsers(1)))
    .protocols(HTTP_CONF)

}
