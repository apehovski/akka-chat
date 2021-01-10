package org.chat.generalroom

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.http.request.builder.HttpRequestBuilder
import org.chat.config.Common
import org.chat.config.Common._
import org.chat.config.Routes._
import org.chat.generalroom.OneUserRoom.sendMessageUser1
import org.chat.login.LoginITest

object OneUserRoom {

  def sendMessageUser1: (String, String) => HttpRequestBuilder =
    sendMessage(Common.userName1)

  def sendMessage(userNickName: UserNameType)(reqName: String, text: String) =
    http(reqName)
      .post(s"$baseURL/$sendRoomMessage")
      .basicAuth(userNickName, userNickName)
      .header("Content-Type", "application/json")
      .body(StringBody(s"""
          {"msgText": "$text"}
      """))
}

class OneUserRoom extends Simulation {

  val msgText1 = "some_text"
  val msgText2 = "some_text_2"

  val scn = scenario("General Room endpoint with 1 user")

    .exec(LoginITest.doLoginUser1("Login for one user room"))

    .exec(sendMessageUser1("Send first general room message", msgText1)
      .check(status.is(200)))

    .exec(http("Check history")
      .get(s"$baseURL/$roomHistory")
      .basicAuth(userName1, userName1)
      .check(jsonPath("$.history[0][0]").is(userName1))
      .check(jsonPath("$.history[0][1]").is(msgText1))
      .check(jsonPath("$.history[1][0]").notExists)
    )

    .exec(sendMessageUser1("Send second general room message", msgText2)
      .check(status.is(200)))

    .exec(http("Check history")
      .get(s"$baseURL/$roomHistory")
      .basicAuth(userName1, userName1)
      .check(jsonPath("$.history[0][0]").is(userName1))
      .check(jsonPath("$.history[0][1]").is(msgText1))
      .check(jsonPath("$.history[1][0]").is(userName1))
      .check(jsonPath("$.history[1][1]").is(msgText2))
      .check(jsonPath("$.history[2][0]").notExists)
    )

  setUp(scn.inject(atOnceUsers(1)))
    .protocols(httpConf)

}
