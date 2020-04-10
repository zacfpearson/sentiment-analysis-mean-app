import { Component, OnInit } from '@angular/core';
import {DatasService} from '../services/web.service';
import {Posts} from '../home/posts.model';

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
            .subscribe(data => console.log(data));
        this.post.unshift(posting);
        this.show = !this.show;
        this.sentiment = 'None';
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
    console.log('checking...');
    this.webService.checkSentiment(posting)
        .subscribe(data => {
          if(data.data == 'Positive Sentiment'){
            this.sentiment = 'Positive';
          } else {
            this.sentiment ='Negetive';
          }
          this.checkingSentiment = false;});
  }

  ngOnInit(): void {
    this.webService.getAllPosts().subscribe((blogPost:Posts[]) => {
      for(var i = 0; i < blogPost.length; i++){
        this.post.unshift(blogPost[i]);
      }
    })
  }

}
