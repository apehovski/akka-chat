package org.chat.config

import io.gatling.core.Predef._
import io.gatling.http.Predef._

object Common {

  val baseURL = "http://localhost:8080/api";

  type UserNameType = String
  val userName1: UserNameType = "first_gatling_user"
  val userName2: UserNameType = "second_gatling_user"

  val httpConf = http
    .baseUrl(baseURL)
    .header("Accept", "*/*")
    .header("Content-Type", "application/json")
//  .proxy(Proxy("localhost", 8888).httpsPort(8888)) // for using HTTP proxy like Fiddler

}
