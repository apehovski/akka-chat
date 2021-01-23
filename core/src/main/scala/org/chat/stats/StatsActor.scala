package org.chat.stats

import akka.actor.{Actor, ActorLogging, ActorSystem, Props}
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.kafka.ProducerSettings
import akka.kafka.scaladsl.Producer
import akka.stream.OverflowStrategy
import akka.stream.scaladsl.Source
import com.typesafe.config.ConfigFactory
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.common.serialization.{StringSerializer, UUIDSerializer}
import org.chat.chatroom.ChatRoomActor.{ChatMessage, MessageAdded}
import org.chat.ws.WsActor.WsSerializable
import spray.json._

import java.util.UUID
import scala.concurrent.ExecutionContextExecutor
import scala.util.{Failure, Success}

object StatsActor {
  def props()(implicit system: ActorSystem, executionContext: ExecutionContextExecutor) =
    Props(new StatsActor())

  sealed trait KafkaEntity //marker for actor protocol
  trait IncomingKafka extends KafkaEntity
  trait OutcomingKafka extends KafkaEntity

  final case class Stats(word: String, count: Long) extends IncomingKafka with WsSerializable
}

trait StatsActorProtocol extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val chatMessageFormat = jsonFormat3(ChatMessage)
}

class StatsActor(implicit system: ActorSystem, ec: ExecutionContextExecutor)
  extends Actor with ActorLogging with StatsActorProtocol {

  val conf = ConfigFactory.load
  val topicTo = conf.getString("chat.topic.messages")
  //other settings - application.conf "akka.kafka.producer"

  val producerSettings =
    ProducerSettings(system, new UUIDSerializer, new StringSerializer)

  val (outputQueue, output) = Source.queue[String](64, OverflowStrategy.dropBuffer).preMaterialize()
  output
    .map(value => new ProducerRecord[UUID, String](topicTo, UUID.randomUUID(), value))
    .runWith(Producer.plainSink[UUID, String](producerSettings))
    .onComplete {
      case Success(_) => log.info(s"Sent successfully to $topicTo")
      case Failure(err) => log.error(err, s"Error while sending to $topicTo")
    }

  def receive = {

    case MessageAdded(outMessage) =>
      //send to Kafka for Stats service consuming
      val msg = outMessage.toJson.compactPrint
      log.info(s"Prepare, topic: $topicTo message: $msg")
      outputQueue.offer(msg)

  }

}
