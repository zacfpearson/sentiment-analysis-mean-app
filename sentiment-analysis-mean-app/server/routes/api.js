const express = require('express');
const router = express.Router();
const Posts = require('../models/posts');

const redis = require("redis");

const publisher = redis.createClient("redis://sentiment-analysis-broker:6379");

router.get('/posts', function(req,res,next){
  Posts.find().exec(function(err, posts){
    if (err) {
      return res.status(500).json({
        title: 'Error',
        error: err
      });
    }
    res.status(200).json({
      message: 'Success',
      obj: posts
    })
  })
});

router.post('/posts', function(req,res,next){
  Posts.create(req.body).then(function(posts){
      res.send(posts);
  }).catch(next);
});

router.delete('/posts/:id', function(req,res,next){
  Posts.findOneAndDelete({_id: req.params.id}).then(function(posts){
    res.send(posts);
  }).catch(next);
});

router.post('/tensorflow/sentiment', function(req,res,next){
  const subscriber = redis.createClient("redis://sentiment-analysis-broker:6379");
  subscriber.on("message", function(channel, message) {
    message = message.toString();
    message = {"data":message};
    res.send(message);
    subscriber.unsubscribe();
    subscriber.quit();
  });
  subscriber.subscribe("sentiment-reply");
  publisher.publish("sentiment-request", JSON.stringify(req.body.post));
});

module.exports = router;
