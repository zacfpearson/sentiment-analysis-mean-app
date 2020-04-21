# SentimentAnalysisMeanApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.7.

## Overview
The purpsose of the sentiment-analysis-mean-app is to provide a simple sentiment analysis mean app. The application accepts text in the form of a 'Post' and forwards that text to a python tensorflow application. The application is currently spawned as a child process of the node server when a new post comes in. HOwever, in the future it will become its own micro-service that gets the text through pub/sub between the itself and the server. The predicted sentiment is then returned and displayed to the web app. 

## Install Dependencies
Run `npm install` to download the necessary node dependencies for building and runnign this app. 
Run `pip install numpy tensorflow tensorflow_hub tensorflow_text pyyaml h5py`

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Start MongoDB

This app depends on a MongoDB server running on local host. The easiest way to get a mongo database up and runnign is with their Docker image.

Must change route to localhost in `server.js`

`docker run -p 27017:27017 --rm mongo:bionic`

## Development server

Run `node server` for a dev server. Navigate to `http://localhost:3000/`. 

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To retrain the model go to the server/training folder. The steps we taken from this [Blog](https://www.curiousily.com/posts/sentiment-analysis-with-tensorflow-2-and-keras-using-python/)
Dependencies for training: `numpy pandas tensorflow sklearn tensorflow_hub tensorflow_text tqdm pyyaml h5py`

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
