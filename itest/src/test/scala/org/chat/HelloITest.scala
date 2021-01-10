package org.chat

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import org.chat.config.Common._

class HelloITest extends Simulation {

  val scn = scenario("Hello endpoint")
    .exec(
      http("Check hello endpoint")
        .get(BASE_URL + "/hello")
        .check(status.is(200))
        .check(regex("Welcome").exists)
    )

  setUp(scn.inject(atOnceUsers(1)))
    .protocols(HTTP_CONF)

}
