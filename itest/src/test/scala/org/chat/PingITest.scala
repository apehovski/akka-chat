package org.chat

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import org.chat.config.Common._

class PingITest extends Simulation {

  val scn = scenario("Ping endpoint")
    .exec(
      http("Check ping endpoint")
        .get(baseURL + "/ping")
        .check(status.is(200))
        .check(regex("pong").exists)
    )

  setUp(scn.inject(atOnceUsers(1)))
    .protocols(httpConf)

}
