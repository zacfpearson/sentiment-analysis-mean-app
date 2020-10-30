const express = require('express');
const router = express.Router();
const Posts = require('../models/posts');

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

module.exports = router;
