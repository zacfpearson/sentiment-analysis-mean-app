const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const redis = require("redis");

/**
 * Redis Pub-Sub Clients
 */
const publisher = redis.createClient("redis://sentiment-analysis-broker:6379");
const subscriber = redis.createClient("redis://sentiment-analysis-broker:6379");
subscriber.subscribe("sentiment-reply");

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'dist/sentiment-analysis-mean-app')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/sentiment-analysis-mean-app/index.html'));
});

const port = '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

const io = require('socket.io')(server);

/**
 * Configure Redis Subscriber
 */
subscriber.on("message", function(channel, message) {
  message = message.toString();
  message = JSON.parse(message);
  socketId = message.clientId;
  sentiment = message.sentiment;
  res = {"data":sentiment};
  io.to(socketId).emit('got-sentiment', res);
});

/**
 * Configure websockets
 */
io.on('connection',function(socket){
  socket.on('get-sentiment', function(msg){
    console.log(msg);
    if(msg.hasOwnProperty("post")){
      if(msg.post.length != 0){
        data={"clientId":socket.id, "post":msg.post};
        publisher.publish("sentiment-request", JSON.stringify(data));
      }
    }
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
