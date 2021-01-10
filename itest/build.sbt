name := "itest"
version := "1.0"

scalaVersion := "2.12.9"
lazy val gatlingVersion = "3.4.2"

enablePlugins(GatlingPlugin)
//Test / fork := false

libraryDependencies ++= Seq(
    "io.gatling.highcharts" % "gatling-charts-highcharts" % gatlingVersion,
    "io.gatling"            % "gatling-test-framework"    % gatlingVersion
)
