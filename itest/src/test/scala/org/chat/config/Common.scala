package org.chat.config

import io.gatling.core.Predef._
import io.gatling.http.Predef._

object Common {

  val baseURL = "http://localhost:8080/api";
  val userName = "gatling_user"

  val httpConf = http
    .baseUrl(baseURL)
    .header("Accept", "*/*")
//  .proxy(Proxy("localhost", 8888).httpsPort(8888)) // for using HTTP proxy like Fiddler

}
