package org.chat

import com.typesafe.config.ConfigFactory
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._
import io.circe.parser._
import org.apache.kafka.streams.scala.StreamsBuilder
import org.apache.kafka.streams.{KafkaStreams, StreamsConfig}

import java.time.Duration
import java.util.{Properties, UUID}


object MessageStatsStream extends App with LazyLogging {
  final case class ChatMessage(text: String, username: String = "", datetime: String = "")

  import org.apache.kafka.streams.scala.ImplicitConversions._
  import org.apache.kafka.streams.scala.kstream._
  import org.apache.kafka.streams.scala.serialization.Serdes._

  val conf = ConfigFactory.load

  val topicFrom = conf.getString("chat.topic.messages")
  val topicTo = conf.getString("chat.topic.stats")
  val kafkaHost = conf.getString("kafka.host")

  val config: Properties = {
    val p = new Properties()
    p.put(StreamsConfig.APPLICATION_ID_CONFIG, "chat-stats")
    p.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaHost)
    p
  }

  val builder = new StreamsBuilder()
  val inputs: KStream[UUID, String] = builder.stream[UUID, String](topicFrom)
  val wordCounts: KTable[String, Long] = inputs
    .peek((k, v) => logger.info(s"Incoming: $k $v"))
    .mapValues(json => {
      decode[ChatMessage](json) match {
        case Right(msg) => msg.text
        case Left(err) => {
          logger.error(s"Error while parsing input message: $json", err)
          ""
        }
      }
    })
    .flatMapValues(textLine => textLine.toLowerCase.split("\\W+"))
    .groupBy((_, word) => word)
    .count()

  wordCounts.toStream
    .peek((k, v) => logger.info(s"Resulting: $k $v"))
    .to(topicTo)

  val topology = builder.build()
  logger.info("Topology: " + topology.describe())

  val streams = new KafkaStreams(topology, config)
  streams.cleanUp()
  streams.start()

  sys.ShutdownHookThread {
    streams.close(Duration.ofSeconds(10))
  }

}