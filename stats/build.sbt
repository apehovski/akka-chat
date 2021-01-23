name := "stats"
version := "1.0"

enablePlugins(JavaAppPackaging)

scalaVersion := "2.12.9"

lazy val kafkaVersion = "2.7.0"
lazy val circeVersion = "0.12.3"

libraryDependencies ++= Seq(
  "com.typesafe" % "config" % "1.3.3",
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.2",
  "ch.qos.logback"    %  "logback-classic"  % "1.2.3",

  "org.apache.kafka" %% "kafka-streams-scala" % kafkaVersion,

  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
)