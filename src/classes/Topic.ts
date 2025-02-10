export class Topic {
  id: number;
  title: string;
  articleIds: number[];

  constructor(id: number, title: string) {
    (this.id = id), (this.title = title);
    this.articleIds = [];
  }

  addArticle(articleId: number): void {
    this.articleIds.push(articleId);
  }

  removeArticle(articleId: number): void {
    this.articleIds = this.articleIds.filter((id) => id !== articleId);
  }
}

// Keeping Topics Class for seperation of concerns and future scale the application with more complex data handling requirements.
