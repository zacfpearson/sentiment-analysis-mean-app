export class Posts {
    title: string;
    post: string;
    date: string;
    fact: string;
    _id?: string;
  
    constructor(title: string, post: string, date: string, fact: string, postID?: string){
      this.title = title;
      this.post = post;
      this.date = date;
      this.fact = fact;
      this._id = postID;
    }
  }
  