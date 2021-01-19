package org.chat.generalroom

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.http.request.builder.HttpRequestBuilder
import org.chat.config.Common
import org.chat.config.Common._
import org.chat.config.Routes._
import org.chat.generalroom.OneUserRoom.sendMessageUser1
import org.chat.auth.LoginTest

object OneUserRoom {

  def sendMessageUser1: (String, String) => HttpRequestBuilder =
    sendMessage(Common.userName1)

  def sendMessage(userNickName: UserNameType)(reqName: String, text: String) =
    http(reqName)
      .post(s"$baseURL/$sendRoomMessage")
      .basicAuth(userNickName, userNickName)
      .body(StringBody(s"""
          {"text": "$text"}
      """))
}

class OneUserRoom extends Simulation {

  val text1 = "some_text"
  val text2 = "some_text_2"

  val scn = scenario("General Room endpoint with 1 user")

    .exec(LoginTest.doLoginUser1("Login for one user room"))

    .exec(sendMessageUser1("Send first general room message", text1)
      .check(status.is(200)))

    .exec(http("Check history")
      .get(s"$baseURL/$roomHistory")
      .basicAuth(userName1, userName1)
      .check(jsonPath("$.history[0].username").is(userName1))
      .check(jsonPath("$.history[0].text").is(text1))
      .check(jsonPath("$.history[1]").notExists)
    )

    .exec(sendMessageUser1("Send second general room message", text2)
      .check(status.is(200)))

    .exec(http("Check history")
      .get(s"$baseURL/$roomHistory")
      .basicAuth(userName1, userName1)
      .check(jsonPath("$.history[0].username").is(userName1))
      .check(jsonPath("$.history[0].text").is(text1))
      .check(jsonPath("$.history[1].username").is(userName1))
      .check(jsonPath("$.history[1].text").is(text2))
      .check(jsonPath("$.history[2]").notExists)
    )

  setUp(scn.inject(atOnceUsers(1)))
    .protocols(httpConf)

}
