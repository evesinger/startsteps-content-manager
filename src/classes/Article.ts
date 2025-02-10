//import { Author } from "./Author";

export class Article {
  id: number;
  title: string;
  //author: Author;
  text: string;
  views: number;
  createdAt: Date;

  constructor(
    id: number,
    title: string,
    text: string,
    views: number,
    createdAt: Date,
  ) {
    this.id = id;
    this.title = title;
    //this.author = author_id;
    this.text = text;
    this.views = views;
    this.createdAt = createdAt;
  }
}

// Keeping Article Class for seperation of concerns and future scale the application with more complex data handling requirements.
