export class Topic {
  static topicCounter: number = 1;
  id: number;
  title: string;
  articleIds: number[]; // ADDED:  articleIds, storing references to article IDs

// ADDED: articleIds into constructor
  constructor(title: string) {
    this.id = Topic.topicCounter++;
    this.title = title;
    this.articleIds = []; 
  }

  addArticle(articleId: number): void {
    this.articleIds.push(articleId);
  }

  removeArticle(articleId: number): void {
    this.articleIds = this.articleIds.filter(id => id !== articleId);
  }
}
