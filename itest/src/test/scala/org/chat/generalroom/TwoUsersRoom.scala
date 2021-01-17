package org.chat.generalroom

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import org.chat.config.Common._
import org.chat.config.Routes._
import org.chat.generalroom.OneUserRoom.sendMessage
import org.chat.auth.LoginTest

object TwoUsersRoom {

  def sendMessage(reqName: String, text: String) =
    http(reqName)
      .post(s"$baseURL/$sendRoomMessage")
      .basicAuth(userName1, userName1)
      .body(StringBody(s"""
          {"text": "$text"}
      """))

}

class TwoUsersRoom extends Simulation {

  val text1 = "text1 from user1"
  val text2 = "text2 from user2"

  val scn = scenario("General Room endpoint with 2 users")

    .exec(LoginTest.doLogin(userName1)("Login of user1 for two users room"))
    .exec(sendMessage(userName1)("Send message from user 1", text1)
      .check(status.is(200)))

    .exec(LoginTest.doLogin(userName2)("Login of user2 for two users room"))
    .exec(sendMessage(userName2)("Send message from user 2", text2)
      .check(status.is(200)))

    .exec(http("Check history")
      .get(s"$baseURL/$roomHistory")
      .basicAuth(userName1, userName1)
      .check(jsonPath("$.history[0][0]").is(userName1))
      .check(jsonPath("$.history[0][1]").is(text1))
      .check(jsonPath("$.history[1][0]").is(userName2))
      .check(jsonPath("$.history[1][1]").is(text2))
      .check(jsonPath("$.history[2][0]").notExists)
    )

  setUp(scn.inject(atOnceUsers(1)))
    .protocols(httpConf)

}
