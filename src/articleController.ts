import express, { Request, Response } from 'express';
import { Article } from './Article';
import { dummyDataBase } from './dummyDataBase';
import { Topic } from './Topic';

const router = express.Router();

// Get all articles for a topic
router.get('/:topicId/articles', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  const topic = dummyDataBase.topics.find(t => t.id === topicId);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  res.json(topic.articles);
});

// Get a specific article in a topic
router.get('/:topicId/articles/:articleId', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  const articleId = parseInt(req.params.articleId);

  const topic = dummyDataBase.topics.find(t => t.id === topicId);
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  const article = topic.getArticle(articleId);
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.json(article);
});

// Create an article for a specific topic
router.post('/:topicId/articles', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  const topic = dummyDataBase.topics.find(t => t.id === topicId);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  const { title, author, text } = req.body;
  if (!title || !author || !text) {
    return res.status(400).json({ error: "Title, Author, and Text are required" });
  }

  const newArticle = new Article(title, author, text, topicId);
  topic.addArticle(newArticle);
  res.status(201).json(newArticle);
});

// Delete an article from a topic
router.delete('/:topicId/articles/:articleId', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  const articleId = parseInt(req.params.articleId);

  const topic = dummyDataBase.topics.find(t => t.id === topicId);
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  const articleIndex = topic.articles.findIndex(article => article.id === articleId);
  if (articleIndex === -1) {
    return res.status(404).json({ error: "Article not found" });
  }

  topic.articles.splice(articleIndex, 1); // Remove the article
  res.status(204).send();
});

export default router;
