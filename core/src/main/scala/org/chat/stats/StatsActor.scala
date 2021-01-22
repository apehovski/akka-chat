package org.chat.stats

import akka.actor.{Actor, ActorLogging, ActorSystem, Props}
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.kafka.ProducerSettings
import akka.kafka.scaladsl.Producer
import akka.stream.scaladsl.Source
import com.typesafe.config.ConfigFactory
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.common.serialization.{StringSerializer, UUIDSerializer}
import org.chat.chatroom.ChatRoomActor.{ChatMessage, MessageAdded}
import spray.json._

import java.util.UUID
import scala.concurrent.ExecutionContextExecutor
import scala.util.{Failure, Success}

object StatsActor {
  def props()(implicit system: ActorSystem, executionContext: ExecutionContextExecutor) =
    Props(new StatsActor())
}

trait StatsActorProtocol extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val chatMessageFormat = jsonFormat3(ChatMessage)
}

class StatsActor(implicit system: ActorSystem, ec: ExecutionContextExecutor)
  extends Actor with ActorLogging with StatsActorProtocol {

  val conf = ConfigFactory.load
  val producerSettings =
    ProducerSettings(system, new UUIDSerializer, new StringSerializer)

  def receive = {

    case MessageAdded(outMessage) =>
      //send to Kafka for Stats service consuming
      val msg = outMessage.toJson.compactPrint
      val topic = conf.getString("chat.topic.messages")
      log.info(s"Stats: prepare, topic: $topic message: $msg")

      Source.single(msg)
        .map(value => new ProducerRecord[UUID, String](topic, UUID.randomUUID(), value))
        .runWith(Producer.plainSink[UUID, String](producerSettings))
        .onComplete {
          case Success(_) => log.info(s"Stats: Out sent successfully, topic: $topic message: $msg")
          case Failure(err) => log.error(err, s"Stats: Error while sending, topic: $topic message: $msg")
        }
  }

}
