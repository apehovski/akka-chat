package org.chat.stats

import akka.actor.{Actor, ActorLogging, ActorSystem, Props}
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.kafka.ProducerSettings
import akka.kafka.scaladsl.Producer
import akka.stream.scaladsl.Source
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.common.serialization.StringSerializer
import org.chat.chatroom.ChatRoomActor.{ChatMessage, MessageAdded}
import spray.json._

import scala.concurrent.ExecutionContextExecutor
import scala.util.{Failure, Success}

object StatsActor {
  def props()(implicit system: ActorSystem, executionContext: ExecutionContextExecutor) =
    Props(new StatsActor())

  final case class StatsMessageAdded(username: String, text: String)
}

trait StatsActorProtocol extends SprayJsonSupport with DefaultJsonProtocol {
  implicit val chatMessageFormat = jsonFormat3(ChatMessage)
}

class StatsActor(implicit system: ActorSystem, ec: ExecutionContextExecutor)
  extends Actor with ActorLogging with StatsActorProtocol {

  val producerSettings =
    ProducerSettings(system, new StringSerializer, new StringSerializer)

  def receive = {

    case MessageAdded(msg) =>
      //send to Kafka for Stats service consuming
      val outMessage = msg.toJson.compactPrint
      log.info("Out Stats: " + outMessage)

      Source.single(outMessage)
        .map(value => new ProducerRecord[String, String]("chat-messages", value))
        .runWith(Producer.plainSink[String, String](producerSettings))
        .onComplete {
          case Success(_) => log.info("Out Stats sent successfully: " + outMessage)
          case Failure(err) => log.error(err, "Error while sending to Stats")
        }
  }

}
