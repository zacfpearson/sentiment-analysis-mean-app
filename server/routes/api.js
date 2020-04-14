const express = require('express');
const router = express.Router();
const Posts = require('../models/posts');
var spawn = require('child_process').spawn;

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
  let deets = [];
  var process = spawn('python3', ["./server/routes/learning/predict.py",
   req.body.title,
   req.body.post,
   req.body.date
  ]);
  process.stdout.on('data', function (data) {
    deets.push(data);
  });
  process.stderr.on('data', function (data) {
    console.log(data.toString());
  });
  process.stdout.on('end', function () {
    deets = Buffer.concat(deets);
    deets = deets.toString();
    deets = {"data":deets.substring(0,deets.length-1)};
    res.send(deets);
  });
});

module.exports = router;
