const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const api = require('./server/routes/api');

const app = express();

//connect to mogoDB
let uri = 'mongodb://localhost/inputs';

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

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
