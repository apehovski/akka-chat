package org.chat.stats

import akka.actor.ActorRef
import akka.kafka.scaladsl.Consumer
import akka.kafka.{ConsumerSettings, Subscriptions}
import org.apache.kafka.common.serialization.{LongDeserializer, StringDeserializer}
import org.chat.RunApp.{conf, system}
import org.chat.stats.StatsActor.Stats

class StatsConsumer(generalRoom: ActorRef) {

  def runConsumer() = {
    val consumerSettings =
      ConsumerSettings(system, new StringDeserializer, new LongDeserializer)
    val topicFrom = conf.getString("chat.topic.stats")
    //other settings - application.conf "akka.kafka.consumer"

    Consumer
      .plainSource(consumerSettings, Subscriptions.topics(topicFrom))
      .map { incoming =>
        println(s"Incoming from $topicFrom: $incoming")
        Stats(incoming.key(), incoming.value())
      }
      .runForeach(stats => generalRoom ! stats)
  }


}
