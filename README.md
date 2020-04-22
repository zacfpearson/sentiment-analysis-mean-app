# SentimentAnalysisMeanApp

## Overview
The purpsose of the sentiment-analysis-mean-app is to provide a simple sentiment analysis mean app. The application accepts text in the form of a 'Post' and forwards that text to a python tensorflow application. The application is currently spawned as a child process of the node server when a new post comes in. HOwever, in the future it will become its own micro-service that gets the text through pub/sub between the itself and the server. The predicted sentiment is then returned and displayed to the web app. 

## Install Dependencies
Install docker
sentiment-analysis-python-app

## Build
### Network 
Run `docker network create -d bridge sentiment-analysis-bridge`

### Dev
From this directory run: `docker build -t sentiment-analysis:dev -f docker/Dockerfile.dev sentiment-analysis-mean-app`
### Prod
From this directory run: `docker build --no-cache -t sentiment-analysis:prod -f docker/Dockerfile.prod sentiment-analysis-mean-app`

### No Docker
See README in `sentiment-analysis-mean-app`

## Start MongoDB

This app depends on a MongoDB server running on the same bridge network with the resovable hostname `sentiment-analysis-db`. The easiest way to get a mongo database up and runnign is with their Docker image.
`docker run --network=sentiment-analysis-bridge --name=sentiment-analysis-db --rm mongo:bionic`

## Start redis

This app depends on a redis server running on the same bridge network with the resovable hostname `sentiment-analysis-broker`. The easiest way to get redis up and runnign is with their Docker image.
`docker run --network=sentiment-analysis-bridge --name=sentiment-analysis-broker --rm redis:alpine`

## Development server
### Dev
Run `docker run --network=sentiment-analysis-bridge -p 3000:3000 --rm sentiment-analysis:dev`
### Prod
Run `docker run --network=sentiment-analysis-bridge -p 3000:3000 --rm sentiment-analysis:prod`

## Todo
* [ ] Make mongoDB hostname a cmd arg
* [X] Split python app into seperate service
* [X] Convert Prod Dockerfiles to Alpine after Python separation
* [ ] Make redis hostname a cmd arg
* [ ] Use web sockets for sentiment analysis

