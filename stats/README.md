# Statistics Module

### Features
* Count most trending words in messages of chat-server
* Made them available via Websocket

### Start server application
Expected to be used in Docker environment. Require running Kafka/Zookeeper.  
Demonstrate common usage of kafka-streams, based on Confluent's [WordCountScalaExample.scala](https://github.com/confluentinc/kafka-streams-examples/blob/6.0.1-post/src/main/scala/io/confluent/examples/streams/WordCountScalaExample.scala)  
For running-up:  
`docker-compose up -d zookeeper kafka chat-stats`

### Check content of Kafka
Input topic:  
```shell
docker run -it --rm \
    --network docker_internal \
    -e KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181 \
    bitnami/kafka:latest kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic chat-messages --from-beginning --property print.key=true
```

Output topic:  
```shell
docker run -it --rm \
    --network docker_internal \
    -e KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181 \
    bitnami/kafka:latest kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic chat-stats --from-beginning --property print.key=true \
    --property value.deserializer=org.apache.kafka.common.serialization.LongDeserializer

```



