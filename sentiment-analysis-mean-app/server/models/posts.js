const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create blog schema & model
const PostsSchema = new Schema({
  title:{
    type: String,
    required: [true, 'Title feild is required']
  },
  post:{
    type: String,
    required: [true, 'Post feild is required']
  },
  date : {
    type: String,
    required: [true, 'date feild is required']
  },
  fact : {
    type: String,
    required: [true, 'fact feild is required']
  }

});

const Posts = mongoose.model('posts',PostsSchema);

module.exports = Posts;
