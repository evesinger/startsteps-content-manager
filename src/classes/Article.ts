import validateArticleData from "../helpers";

export class Article {
  static articleCounter: number = 1;
  id: number;
  title: string;
  author: string;
  text: string;
  createdAt: Date;

  constructor(title: string, author: string, text: string, createdAt: Date) {
    this.id = Article.articleCounter++;
    this.title = title;
    this.author = author;
    this.text = text;
    this.createdAt = createdAt
  }
// Static function including helper function 
  static create(title: string, author: string, text: string, createdAt: Date = new Date()): Article {
    validateArticleData(title, author, text, createdAt);  
    return new Article(title!, author!, text!, createdAt);
  }
}
