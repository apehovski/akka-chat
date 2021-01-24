package org.chat.chatroom

import akka.actor.ActorSystem
import akka.testkit.{ImplicitSender, TestKit}
import org.chat.chatroom.ChatRoomActor.GetStats
import org.chat.stats.StatsActor.Stats
import org.scalatest.BeforeAndAfterAll
import org.scalatest.matchers.should.Matchers
import org.scalatest.wordspec.AnyWordSpecLike

import scala.collection.mutable
import scala.concurrent.duration._

class ChatRoomActorSpec
  extends TestKit(ActorSystem("test-chat-actor-system"))
  with ImplicitSender
  with AnyWordSpecLike
  with Matchers
  with BeforeAndAfterAll {

  val duration = 15.seconds

  override def afterAll(): Unit = {
    TestKit.shutdownActorSystem(system)
  }

  "ChatRoomActor" must {
    "fill highestStats with top 5 values" in {
      val room = system.actorOf(ChatRoomActor.props()(system, system.dispatcher))

      //7 incoming values
      room ! Stats("first", 5)
      room ! Stats("second", 15)
      room ! Stats("fifth", 35)
      room ! Stats("fourth", 23)
      room ! Stats("seventh", 48)
      room ! Stats("sixth", 42)
      room ! Stats("third", 18)

      room ! GetStats
      val stats = receiveOne(duration)
        .asInstanceOf[mutable.SortedMap[String, Long]]

      stats.size should be(5)
      stats should not contain key ("first")
      stats should not contain key ("second")
      stats should contain key ("third")
      stats should contain key ("fourth")
      stats should contain key ("fifth")
      stats should contain key ("sixth")
      stats should contain key ("seventh")
    }
  }

}
