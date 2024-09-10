/*import express, { Request, Response } from 'express';
import { dummyDataBase } from './dummyDataBase';

const router = express.Router();

// Show up to 10 latest articles created within the last hour
router.get('/', (req: Request, res: Response) => {
  const oneHourAgo = new Date(Date.now() - 3600 * 1000);
  let recentArticles = [];

  dummyDataBase.topics.forEach((topic) => {
    topic.articles.forEach((article) => {
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
*/