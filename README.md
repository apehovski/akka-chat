# akka-chat

Pet project for some learning in scope of modern web-technologies.

## Live Demo
Available on GCP here: [web-chat](http://35.242.217.130)  

## Features
* *Akka* stack for backend (akka-http, akka-streams)
* *React* stack for front
* Notifications about new messages via *Websockets*
* Basic Auth, CORS
* Fully in-memory storage
* Integration/performance tests using *Gatling*
* Dockerized

### Run on Docker
Zero dependency on jdk/scala/js/npm required.  
Running-up:  
1. Substitute **your_ip** in file `/ui/.env.production` with local Docker host
2. `docker-compose up`

### Run for local development
See then:  
* [Server](/core/README.md)  
* [Frontend](/ui/README.md)  
* [Integration tests](/itest/README.md)  
