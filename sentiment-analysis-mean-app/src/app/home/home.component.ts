import { Component, OnInit } from '@angular/core';
import {Posts} from '../home/posts.model';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  show: boolean = false;
  post: Posts[] = [];
  quant: string[] = [];
  feedBack: string = '';
  title: string = null;
  thought: string = null;
  enteredBlankSentiment: boolean = false;
  blankFields: boolean = false;
  
  socket = io(environment.SOCKET_ENDPOINT);

  sentiment: string = 'None';
  checkingSentiment: boolean = false;

  constructor() { }

  onSubmit(){
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    var time = dateObj.toLocaleTimeString();
    var date = month + '/' + day + '/' + year + ' ' + time;
    if (this.sentiment != 'None' && this.title && this.thought){
        var posting: Posts = new Posts(this.title,this.thought, date, this.sentiment);
        this.post.unshift(posting);
        this.show = !this.show;
        this.sentiment = 'None';
        this.title = null;
        this.thought = null;
        this.enteredBlankSentiment = false;
    } else {
      //TODO: Add this as a for validator!
      this.enteredBlankSentiment = true;
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
  }

  loadSentiment(){
    if(this.title && this.thought){
      this.blankFields = false;
      this.checkingSentiment = true;
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      var time = dateObj.toLocaleTimeString();
      var date = month + '/' + day + '/' + year + ' ' + time;
      var posting: Posts = new Posts(this.title,this.thought, date, this.sentiment);
      this.socket.emit('get-sentiment',posting);
    } else {
      this.blankFields = true;
    }
  }

  ngOnInit(): void {
    this.socket.on('got-sentiment', (data) =>{
      if(data.data == 'Positive Sentiment'){
        this.sentiment = 'Positive';
      } else {
        this.sentiment ='Negetive';
      }
      this.checkingSentiment = false;
      this.enteredBlankSentiment = false;
    });
  }
}
