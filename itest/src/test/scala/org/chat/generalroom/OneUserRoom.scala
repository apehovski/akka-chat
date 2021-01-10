package org.chat.generalroom

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import org.chat.config.Common.{baseURL, httpConf, userName}
import org.chat.config.Routes.{roomHistory, sendRoomMessage}
import org.chat.generalroom.OneUserRoom.sendMessage
import org.chat.login.LoginITest

object OneUserRoom {

  def sendMessage(reqName: String, text: String) =
    http(reqName)
      .post(s"$baseURL/$sendRoomMessage")
      .basicAuth(userName, userName)
      .header("Content-Type", "application/json")
      .body(StringBody(s"""
          {"msgText": "$text"}
      """))
}

class OneUserRoom extends Simulation {

  val msgText1 = "some_text"
  val msgText2 = "some_text_2"

  val scn = scenario("General Room endpoint")

    .exec(LoginITest.doLogin("Login for one user room"))

    .exec(sendMessage("Send first general room message", msgText1)
      .check(status.is(200)))

    .exec(http("Check history")
      .get(s"$baseURL/$roomHistory")
      .basicAuth(userName, userName)
      .check(jsonPath("$.history[0][0]").is(userName))
      .check(jsonPath("$.history[0][1]").is(msgText1))
      .check(jsonPath("$.history[1][0]").notExists)
    )

    .exec(sendMessage("Send second general room message", msgText2)
      .check(status.is(200)))

    .exec(http("Check history")
      .get(s"$baseURL/$roomHistory")
      .basicAuth(userName, userName)
      .check(jsonPath("$.history[0][0]").is(userName))
      .check(jsonPath("$.history[0][1]").is(msgText1))
      .check(jsonPath("$.history[1][0]").is(userName))
      .check(jsonPath("$.history[1][1]").is(msgText2))
      .check(jsonPath("$.history[2][0]").notExists)
    )

  setUp(scn.inject(atOnceUsers(1)))
    .protocols(httpConf)

}
