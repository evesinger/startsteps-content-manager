export interface IArticle {
  id: number;
  title: string;
  author: string;
  text: string;
  topicId: number;
  createdAt: string;
}

export interface ITopic {
  id: number;
  title: string;
  articles: IArticle[]; // Adding an array of articles to the topic
}
