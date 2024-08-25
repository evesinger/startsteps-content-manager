import express, { Request, Response } from 'express';
import { dummyDataBase } from './dummyDataBase';
import { IArticle, ITopic } from './Interfaces';

const router = express.Router();

// Show up to 10 latest articles created within the last hour
router.get('/latest', (req: Request, res: Response) => {
  const oneHourAgo = new Date(Date.now() - 3600 * 1000);
  let recentArticles: IArticle[] = [];

  dummyDataBase.topics.forEach((topic: ITopic) => {
    topic.articles.forEach((article: IArticle) => {
      if (new Date(article.createdAt) >= oneHourAgo) {
        recentArticles.push(article);
      }
    });
  });

  // Sort by creation date and limit to 10 articles
  recentArticles = recentArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(recentArticles.slice(0, 10));
});

export default router;
