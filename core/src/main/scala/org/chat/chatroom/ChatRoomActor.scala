package org.chat.chatroom

import akka.actor.{Actor, ActorLogging, ActorRef, ActorSystem, Props}
import org.chat.RunApp.kafkaEnabled
import org.chat.chatroom.ChatRoomActor._
import org.chat.stats.StatsActor
import org.chat.stats.StatsActor.{OutcomingKafka, Stats}
import org.chat.ws.WsActor._

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import scala.collection.{immutable, mutable}
import scala.concurrent.ExecutionContextExecutor

object ChatRoomActor {
  def props()(implicit system: ActorSystem, executionContext: ExecutionContextExecutor) =
    Props(new ChatRoomActor)

  final case class AddUser(username: String, newUser: ActorRef)
  final case class RemoveUser(username: String)

  final case class MessageToRoom(username: String, text: String)
  final case class MessageAdded(msg: ChatMessage) extends OutcomingWS with OutcomingKafka

  final case class LoadRoomHistory(limit: Int = 50)
  final case class LoadRoomHistoryResp(history: immutable.Seq[ChatMessage])

  final case class ChatMessage(username: String, text: String,
                               datetime: String = currDateTime())

  def currDateTime(): String = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss.SSS"))

  sealed trait UnitTesting
  final case object GetStats extends UnitTesting
}

class ChatRoomActor(implicit system: ActorSystem, executionContext: ExecutionContextExecutor)
  extends Actor with ActorLogging {

  val roomUsers = new mutable.HashMap[String, ActorRef]
  val roomHistory = new mutable.MutableList[ChatMessage]

  val statsActor: Option[ActorRef] =
    if (kafkaEnabled()) Some(system.actorOf(StatsActor.props(), "statsActor"))
    else None

  val highestStats: mutable.SortedMap[String, Long] = mutable.SortedMap()


  def receive = {

    case AddUser(username, newUser) =>
      roomUsers += (username -> newUser)

    case RemoveUser(username) =>
      roomUsers -= username

    case MessageToRoom(username, text) =>
      log.info(s"MessageToRoom from $username: $text")
      val newMessage = ChatMessage(username, text)
      roomHistory += newMessage
      roomUsers.values.foreach(_ ! MessageAdded(newMessage))
      statsActor.map(_ ! MessageAdded(newMessage))

    case LoadRoomHistory(limit) =>
      val historySeq = immutable.Seq(roomHistory.takeRight(limit): _*)
      sender ! LoadRoomHistoryResp(historySeq)

    case wsConnect: WSUserConnected =>
      roomUsers.get(wsConnect.username)
        .foreach { userActor =>
          userActor ! wsConnect

          val fullStats = highestStats.to[immutable.Seq]
            .map(entry => Stats(entry._1, entry._2))
          userActor ! WSFullStats(fullStats)
        }

    case wsDisconnect: WSUserDisconnected =>
      for {
        uname <- wsDisconnect.username
        userActor <- roomUsers.get(uname)
      } yield userActor ! wsDisconnect

    case newStats: Stats => {
      //send via WS only 5 most used words
      val maxSize = 5
      log.info(s"Current stats: $highestStats")

      highestStats.size match {
        case lowSize if lowSize < maxSize =>
          highestStats += (newStats.word -> newStats.count)
          roomUsers.values
            .foreach(_ ! WSStatsUpdate(newStats))

        case _ => //max size
          Some(highestStats.minBy(_._2))
            .filter(currMin => newStats.count > currMin._2)
            .foreach { currMin =>
              if (currMin._1 != newStats.word) {
                highestStats -= currMin._1
              }
              highestStats += (newStats.word -> newStats.count)
              log.info(s"Updated stats: $highestStats")

              roomUsers.values
                .foreach(_ ! WSStatsUpdate(newStats))
            }
      }
    }

    case GetStats =>
      sender ! highestStats

    case any =>
      log.warning(s"Unknown message: $any")

  }

}
