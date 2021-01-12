name := "core"
version := "1.0"

enablePlugins(JavaAppPackaging)

scalaVersion := "2.12.9"

lazy val akkaVersion = "2.5.25"
lazy val akkaHttpVersion = "10.1.9"

libraryDependencies ++= Seq(
  "com.typesafe.akka" %% "akka-actor" % akkaVersion,
  "com.typesafe.akka" %% "akka-stream" % akkaVersion,
  "com.typesafe.akka" %% "akka-http" % akkaHttpVersion,
  "com.typesafe.akka" %% "akka-http-spray-json" % akkaHttpVersion,

  "com.typesafe.akka" %% "akka-slf4j"       % akkaVersion,
  "ch.qos.logback"    %  "logback-classic"  % "1.2.3",

  "com.typesafe.akka" %% "akka-testkit" % akkaVersion % Test,
  "org.scalatest" %% "scalatest" % "3.1.0-M1" % Test
)
