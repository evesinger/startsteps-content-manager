import { IArticle } from './Interfaces';

export class Article implements IArticle {
  static articleCount: number = 1;

  // Properties
  id: number;
  title: string;
  author: string;
  text: string;
  topicId: number;
  createdAt: string;

  constructor(title: string, author: string, text: string, topicId: number, createdAt: string = new Date().toISOString()) {
    this.id = Article.articleCount++; // Assigning a unique id to each article
    this.title = title;
    this.author = author;
    this.text = text;
    this.topicId = topicId;
    this.createdAt = createdAt;
  }
}
