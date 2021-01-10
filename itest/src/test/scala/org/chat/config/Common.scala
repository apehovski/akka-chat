package org.chat.config

import io.gatling.core.Predef._
import io.gatling.http.Predef._

object Common {

  val BASE_URL = "http://localhost:8080/api";

  val HTTP_CONF = http
    .baseUrl(BASE_URL)
    .header("Accept", "*/*")
//  .proxy(Proxy("localhost", 8888).httpsPort(8888)) // for using HTTP proxy like Fiddler

}
