const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const redis = require("redis");

const publisher = redis.createClient("redis://sentiment-analysis-broker:6379");
const subscriber = redis.createClient("redis://sentiment-analysis-broker:6379");

subscriber.subscribe("sentiment-reply");

const api = require('./server/routes/api');

const app = express();

//connect to mogoDB
let uri = 'mongodb://sentiment-analysis-db/inputs';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true
});

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'dist/sentiment-analysis-mean-app')));

app.use('/api', api);

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

subscriber.on("message", function(channel, message) {
  message = message.toString();
  message = JSON.parse(message);
  socketId = message.clientId;
  sentiment = message.sentiment;
  res = {"data":sentiment};
  io.to(socketId).emit('got-sentiment', res);
});

io.on('connection',function(socket){
  socket.on('get-sentiment', function(msg){
    console.log(msg);
    data={"clientId":socket.id, "post":msg.post};
    publisher.publish("sentiment-request", JSON.stringify(data));
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
