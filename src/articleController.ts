import express, { Request, Response } from 'express';
import { Article } from './Article';
import { dummyDataBase } from './dummyDataBase';

const router = express.Router();

// ENDPOINT 1. Get all articles, optionally filtered by topicId
router.get('/', (req: Request, res: Response) => {
  const { topicId } = req.query;


  if (topicId !== undefined) {
    const parsedTopicId = parseInt(topicId as string); // in case input in stting parse it to number 
    if (isNaN(parsedTopicId)) {
      return res.status(400).json({ error: "Invalid topicId. It must be a number." }); // if even after parsing it is NaN, return error.
    }

    const topic = dummyDataBase.topics.find(t => t.id === parsedTopicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const articles = topic.articleIds.map(id => 
      dummyDataBase.articles.find(article => article.id === id)
    ).filter(article => article !== undefined); 

    return res.json(articles); 
  }

const allArticles = dummyDataBase.articles; 
  res.json(allArticles);
});

// ENDPOINT 2. Get a specific article by its articleID

router.get('/:articleId(\\d+)', (req: Request, res: Response) => {
  const articleId = parseInt(req.params.articleId);

  if (isNaN(articleId)) {
    return res.status(400).json({ error: "Invalid articleId. It must be a number." });
  }

  const article = dummyDataBase.articles.find(article => article.id === articleId);

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.json(article);
});


// ENDPOINT 3. Update an article by its ID
router.put('/:articleId', (req: Request, res: Response) => {
  const articleId = parseInt(req.params.articleId);
  const { title, author, text } = req.body;

  if (isNaN(articleId)) {
    return res.status(400).json({ error: "Invalid articleId. It must be a number." });
  }

  const article = dummyDataBase.articles.find(article => article.id === articleId);

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  if (title) article.title = title;
  if (author) article.author = author;
  if (text) article.text = text;

  res.json(article);
});

// ENDPOINT 4 Delete an article by its ID
router.delete('/:articleId', (req: Request, res: Response) => {
  const articleId = parseInt(req.params.articleId);

  if (isNaN(articleId)) {
    return res.status(400).json({ error: "Invalid articleId. It must be a number." });
  }

  const articleIndex = dummyDataBase.articles.findIndex(article => article.id === articleId);

  if (articleIndex === -1) {
    return res.status(404).json({ error: "Article not found" });
  }

  dummyDataBase.articles.splice(articleIndex, 1);

  for (const topic of dummyDataBase.topics) {
    topic.removeArticle(articleId);
  }
  res.status(204).send();
});

  // ENDPOINT 5: Getting latest articles
  router.get('/latest', (req: Request, res: Response) => {
  
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // current time minus 1 hour
    let articles = dummyDataBase.articles.filter(article => new Date(article.createdAt) > oneHourAgo);
    res.json(articles); // **return  10 latest articles** .slice(0, 10)
  });
  
  export default router;

  // ENDPOINT 7. Create a new article withouth linking to a topic
router.post('/', (req: Request, res: Response) => {
  const { title, author, text } = req.body;

  if (!title || !author || !text) {
    return res.status(400).json({ error: "Title, Author, and Text are required" });
  }

  const newArticle = new Article(title, author, text, new Date());
  dummyDataBase.articles.push(newArticle); 

  res.status(200).json(newArticle);
});
