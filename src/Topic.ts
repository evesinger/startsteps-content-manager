import { ITopic, IArticle } from './Interfaces';

export class Topic implements ITopic {
  static topicCounter: number = 1;

  id: number;
  title: string;
  articles: IArticle[];

  constructor(title: string) {
    this.id = Topic.topicCounter++;
    this.title = title;
    this.articles = []; // Initialized as an empty array
  }

  // Method to add an article to the topic
  addArticle(article: IArticle): void {
    this.articles.push(article);
  }

  // Method to remove an article by article ID
  removeArticle(articleId: number): void {
    this.articles = this.articles.filter(article => article.id !== articleId);
  }

  // Method to get an article by its ID
  getArticle(articleId: number): IArticle | undefined {
    return this.articles.find(article => article.id === articleId);
  }
}
