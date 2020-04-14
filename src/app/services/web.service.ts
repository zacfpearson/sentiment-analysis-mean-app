import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Posts} from '../home/posts.model';

@Injectable()
export class DatasService {

  private posts: Posts[] = [];

  constructor(private http: HttpClient){
  }

  addPost(post: Posts){
    //let post = this.posts.unshift(post);
    return this.http.post<Posts>('/api/posts', post)
        .pipe(map(response => response));
  }

  getAllPosts(){
    return this.http.get<{message: String, obj: Posts[]}>('/api/posts')
        .pipe(map(response => {
          const posts = response.obj;
          let transformedPosts: Posts[] = [];
          for( let post of posts ){
            transformedPosts.push(new Posts(post.title,post.post,post.date,post.fact,post._id));
          }
          this.posts = transformedPosts;
          return transformedPosts;
        }));
  }

  deletePost(post: Posts){
    return this.http.delete<{message: String, obj: Posts}>('/api/posts/'+post._id)
      .pipe(map(response => response));
  }

  checkSentiment(post: Posts){
    const headers = new Headers({'Content-Type':'application/json'});
    return this.http.post<{data: String}>('/api/tensorflow/sentiment',post)
        .pipe(map(response => response));
  }
}
