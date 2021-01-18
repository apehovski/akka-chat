package org.chat

import io.gatling.core.Predef._
import io.gatling.http.Predef.{http, ws, _}

class PingWSTest extends Simulation {

  val wsProtocol = http.wsBaseUrl("ws://localhost:8080/api")

  val scene = scenario("testWebSocket")
    .exec(ws("openSocket").connect("/pingWS")
      .onConnected(
        exec(ws("sendMessage")
          .sendText("some_input_text")
          .await(20)(
            ws.checkTextMessage("check1")
              .check(regex(".*pong.*").saveAs("myMessage"))
          )
        )
      )
    )
    .exec(session => session {
      println("Output from web-chat is: " + session("myMessage").as[String])
      session
    })
    .exec(ws("closeConnection").close)

  setUp(scene.inject(atOnceUsers(1))
    .protocols(wsProtocol))

}
