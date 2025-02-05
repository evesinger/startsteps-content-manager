//import { Author } from "./Author";

export class Article {
  id: number;
  title: string;
  authorId: number;  // to store author ids
  text: string;
  views: number;
  createdAt: Date;

  constructor(id: number, title: string, authorId: number, text: string, views: number, createdAt: Date) {
    this.id = id;
    this.title = title;
    this.authorId = authorId;
    this.text = text;
    this.views = views
    this.createdAt = createdAt
  }
}

// Keeping Article Class for seperation of concerns and future scale the application with more complex data handling requirements.