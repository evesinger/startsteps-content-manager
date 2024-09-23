import express, { Request, Response } from 'express';
import { Article } from './Article';
import { dummyDataBase, hardCodedDate } from './dummyDataBase';

const router = express.Router();

// EDITED: ENDPOINT 1. Get all articles, optionally filtered by topicId
router.get('/', (req: Request, res: Response) => {
  const { topicId } = req.query;


  if (topicId !== undefined) {
    const parsedTopicId = parseInt(topicId as string, 10); // in case input in stting parse it to number 
    if (isNaN(parsedTopicId)) {
      return res.status(400).json({ error: "Invalid topicId. It must be a number." }); // if even after parsing it is NaN, return error.
    }

    const topic = dummyDataBase.topics.find(t => t.id === parsedTopicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const articles = topic.articleIds.map(id => 
      dummyDataBase.articles.find(article => article.id === id)
    ).filter(article => article !== undefined); // making sure article is not undefined

    return res.json(articles); 
  }

  //-> Directly assesing the articles array (without topic dependency)
const allArticles = dummyDataBase.articles; 
  res.json(allArticles);
});

// EDITED: ENDPOINT 2. Get a specific article by its articleID
router.get('/:articleId', (req: Request, res: Response) => {
  const articleId = parseInt(req.params.articleId, 10);

  if (isNaN(articleId)) {
    return res.status(400).json({ error: "Invalid articleId. It must be a number." });
  }

  const article = dummyDataBase.articles.find(article => article.id === articleId);

  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }

  res.json(article);
});

// ENDPOINT 3. Create a new article without specifying a topic
router.post('/', (req: Request, res: Response) => {
  const { title, author, text } = req.body;

  if (!title || !author || !text) {
    return res.status(400).json({ error: "Title, Author, and Text are required" });
  }

  const newArticle = new Article(title, author, text, hardCodedDate)
  dummyDataBase.articles.push(newArticle); // Add to global articles list

  res.status(200).json(newArticle);
});

// ENDPOINT 4. Update an article by its ID
router.put('/:articleId', (req: Request, res: Response) => {
  const articleId = parseInt(req.params.articleId, 10);
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

// EDITED: ENDPOINT 5 Delete an article by its ID
router.delete('/:articleId', (req: Request, res: Response) => {
  const articleId = parseInt(req.params.articleId, 10);

  if (isNaN(articleId)) {
    return res.status(400).json({ error: "Invalid articleId. It must be a number." });
  }

  const articleIndex = dummyDataBase.articles.findIndex(article => article.id === articleId);

  if (articleIndex === -1) {
    return res.status(404).json({ error: "Article not found" });
  }

  //ADDED: remove the article from the global articles list
  dummyDataBase.articles.splice(articleIndex, 1);

  //also remove this article from any topics that reference it
  for (const topic of dummyDataBase.topics) {
    topic.removeArticle(articleId);
  }
  res.status(204).send();

  // 09.23 
  router.get('/latest', (req: Request, res: Response) => {
    const { topicId } = req.query;
  
    if (topicId !== undefined) {
      const parsedTopicId = parseInt(topicId as string, 10);
      if (isNaN(parsedTopicId)) {
        return res.status(400).json({ error: "Invalid topicId. It must be a number." });
      }
  
      const topic = dummyDataBase.topics.find(t => t.id === parsedTopicId);
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }
  
      const articles = topic.articleIds
        .map(id => dummyDataBase.articles.find(article => article.id === id))
        .filter(article => article !== undefined)
        .sort((a, b) => (a && b && a.createdAt > b.createdAt ? -1 : 1)); // Sort by date (newest first)
  
      return res.json(articles.slice(0, 5)); 
    }
  
    const allArticles = dummyDataBase.articles
      .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)) // Sort by date (newest first)
      .slice(0, 5); 
  
    res.json(allArticles);
  });

  
});



export default router;