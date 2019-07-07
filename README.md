# Chat application using Websockets

This is a hobby project to demonstrate realtime we app development using websockets in nodejs.

## Steps to run backend service
1. Run command `docker-compose up -d`

## Features

- [ ] Google plus sign in
- [ ] Private Chat
- [ ] Group Chat

## ER-Diagram

<img src="./documentation/ER-Diagrams/ER-Diagram.jpeg">

[ER-Diagram](./documentation/ER-Diagrams/ER-Diagram.jpeg)

## Choosing database to store above entities

#### Relational vs Non relational

As the scale and requirements for this proof of concept can be easily satisfied by a relational database, I am going forward and using  `MYSQL 8.x.x`. Will update this readme if there is any change of plans.

## Microservices

### Auth service

This service will handle the client auth and registration tasks!

### Chat service

This service will handle websocket connections with our clients. This will handle the message traffic on real time basis.

### Redis Id generation service

This service will help generate ids so as to support in horizontal scaling our relational database. We will be distributing users onto a new MySQL instance once we have generated `N` number of ids. Once we reach this `N` threshold, we will reset the Id counter and update the database name to a new db instance so that the new Ids will map to the new MySQL instance!