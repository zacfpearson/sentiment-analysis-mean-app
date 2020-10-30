import { Component, OnInit } from '@angular/core';
import {DatasService} from '../services/web.service';
import {Posts} from '../home/posts.model';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [DatasService]
})
export class HomeComponent implements OnInit {

  show: boolean = false;
  post: Posts[] = [];
  quant: string[] = [];
  feedBack: string = '';
  title: string = null;
  thought: string = null;
  
  socket = io('127.0.0.1:3000');

  sentiment: string = 'None';
  checkingSentiment: boolean = false;

  constructor(private webService: DatasService) { }

  onSubmit(){
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var time = dateObj.toLocaleTimeString();
    var date = month + '/' + day + '/' + year + ' ' + time;
    if (this.sentiment != 'None'){
        var posting: Posts = new Posts(this.title,this.thought, date, this.sentiment);
        this.webService.addPost(posting)
            .subscribe(data => {
              var posting_return: Posts = new Posts(data.title,data.post, data.date, data.fact, data._id);
              this.post.unshift(posting_return);
              this.show = !this.show;
              this.sentiment = 'None';
            });
    } else {
      console.log('Sentiment Check Needed');
    }
  }

  newField(){
    this.quant = [];
    this.show = !this.show;
    this.sentiment = 'None';
  }

  onDelete(blog){
    let index: number = this.post.indexOf(blog);
    if (index !== -1) {
        this.post.splice(index, 1);
    }
    this.webService.deletePost(blog)
        .subscribe();
  }

  loadSentiment(){
    this.checkingSentiment = true;
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var time = dateObj.toLocaleTimeString();
    var date = month + '/' + day + '/' + year + ' ' + time;
    var posting: Posts = new Posts(this.title,this.thought, date, this.sentiment);
    this.socket.emit('get-sentiment',posting);
  }

  ngOnInit(): void {
    this.webService.getAllPosts().subscribe((blogPost:Posts[]) => {
      for(var i = 0; i < blogPost.length; i++){
        this.post.unshift(blogPost[i]);
      }
    });
    this.socket.on('got-sentiment', (data) =>{
      console.log(data);
          if(data.data == 'Positive Sentiment'){
            this.sentiment = 'Positive';
          } else {
            this.sentiment ='Negetive';
          }
          this.checkingSentiment = false;
    });
  }
}
