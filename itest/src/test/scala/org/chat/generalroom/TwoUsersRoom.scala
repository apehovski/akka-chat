package org.chat.generalroom

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import org.chat.config.Common._
import org.chat.config.Routes._
import org.chat.generalroom.OneUserRoom.sendMessage
import org.chat.login.LoginITest

object TwoUsersRoom {

  def sendMessage(reqName: String, text: String) =
    http(reqName)
      .post(s"$baseURL/$sendRoomMessage")
      .basicAuth(userName1, userName1)
      .header("Content-Type", "application/json")
      .body(StringBody(s"""
          {"msgText": "$text"}
      """))

}

class TwoUsersRoom extends Simulation {

  val msgText1 = "text1 from user1"
  val msgText2 = "text2 from user2"

  val scn = scenario("General Room endpoint with 2 users")

    .exec(LoginITest.doLogin(userName1)("Login of user1 for two users room"))
    .exec(sendMessage(userName1)("Send message from user 1", msgText1)
      .check(status.is(200)))

    .exec(LoginITest.doLogin(userName2)("Login of user2 for two users room"))
    .exec(sendMessage(userName2)("Send message from user 2", msgText2)
      .check(status.is(200)))

    .exec(http("Check history")
      .get(s"$baseURL/$roomHistory")
      .basicAuth(userName1, userName1)
      .check(jsonPath("$.history[0][0]").is(userName1))
      .check(jsonPath("$.history[0][1]").is(msgText1))
      .check(jsonPath("$.history[1][0]").is(userName2))
      .check(jsonPath("$.history[1][1]").is(msgText2))
      .check(jsonPath("$.history[2][0]").notExists)
    )

  setUp(scn.inject(atOnceUsers(1)))
    .protocols(httpConf)

}
