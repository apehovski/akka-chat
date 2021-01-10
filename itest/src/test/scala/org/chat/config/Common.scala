package org.chat.config

import io.gatling.core.Predef._
import io.gatling.http.Predef._

object Common {

  val BASE_URL = "http://localhost:8080";

  val HTTP_CONF = http
    .baseUrl(BASE_URL)
    .header("Accept", "application/json")
//  .proxy(Proxy("localhost", 8888).httpsPort(8888)) // uncomment this line if you want to run through a HTTP proxy such as Fiddler or Charles Proxy


}
