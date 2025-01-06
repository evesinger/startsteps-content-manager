import validateArticleData from "../helpers";
//import { Author } from "./Author";

export class Article {
  static articleCounter: number = 1;
  id: number;
  title: string;
  //author: Author;
  text: string;
  createdAt: Date;

  constructor(title: string, text: string, createdAt: Date) {
    this.id = Article.articleCounter++;
    this.title = title;
    //this.author = author;
    this.text = text;
    this.createdAt = createdAt
  }
// Static function including helper function 
  static create(title: string, text: string, createdAt: Date = new Date()): Article {
    validateArticleData(title, text, createdAt);  
    return new Article(title!, text!, createdAt);
  }
}
