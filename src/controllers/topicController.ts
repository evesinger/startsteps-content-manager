import express, { Request, Response } from 'express';
import { dummyDataBase } from '../database/dummyDataBase';
import { Topic } from '../classes/Topic';
import { Article } from '../classes/Article';

const router = express.Router();

//ENDPOINT 1. Create a new topic
router.post('/', (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const existingTopic = dummyDataBase.topics.find(topic => topic.title.toLowerCase() === title.toLowerCase());
  if (existingTopic) {
    return res.status(400).json({ error: "A topic with this title already exists" });
  }
  const newTopic = new Topic(title); 
  dummyDataBase.topics.push(newTopic);

  res.status(200).json(newTopic);
});

// ENDPOINT 2: Delete a topic
router.delete('/:topicId', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  const topicIndex = dummyDataBase.topics.findIndex(t => t.id === topicId);

  if (topicIndex === -1) {
    return res.status(404).json({ error: 'Topic not found' });
  }

  dummyDataBase.topics.splice(topicIndex, 1);
  res.status(204).send();
});

// ENDPOINT 3. List all topics
router.get('/', (req: Request, res: Response) => {
  console.log('Returning all topics:', dummyDataBase.topics)
  res.json(dummyDataBase.topics);
});

// ENDPOINT 4. Show a specific topic
router.get('/:topicId', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  const topic = dummyDataBase.topics.find(t => t.id === topicId);
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }
  console.log(`Returning topic with ID ${topicId}:`, topic)

  res.json(topic);
});


// ENDPOINT 5. Get all articles for a specific topic 
router.get('/:topicId/articles', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId, 10);  // based on feedback using path parameter instead of query parameter

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  const topic = dummyDataBase.topics.find(t => t.id === topicId);
  
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }
  const articles = topic.articleIds.map(id => 
    dummyDataBase.articles.find(article => article.id === id)
  ).filter(article => article !== undefined); // filtering out undefined results

  res.json(articles);
});


// ENDPOINT 6: Update a topic (by linking existing article)
router.put('/:topicId', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  const topic = dummyDataBase.topics.find(t => t.id === topicId);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  try {
    const { articleIds } = req.body;
    
    if (!articleIds || !Array.isArray(articleIds)) { 
      return res.status(400).json({ error: "Article IDs must be provided as an array." });
    }

    articleIds.forEach(articleId => {
      const existingArticle = dummyDataBase.articles.find(article => article.id === articleId); // Check if article exists

      if (!existingArticle) {
        return res.status(404).json({ error: `Article with ID ${articleId} not found.` });
      }

      // Add the article to the topic if not already added
      if (!topic.articleIds.includes(existingArticle.id)) {
        topic.addArticle(existingArticle.id);
      }
    });

    res.status(200).json({ message: "Articles updated for the topic", topic });
  } catch (error: any) {
    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

// ENDPOINT 7. Create a new article linked to a specific topic
router.post('/:topicId/articles', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  const topic = dummyDataBase.topics.find(t => t.id === topicId);
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  const { title, author, text } = req.body;
  if (!title || !author || !text) {
    return res.status(400).json({ error: "Title, Author, and Text are required" });
  }

  const newArticle = new Article(title, author, text, new Date()); // -> now using current date not hardcoded one 
  dummyDataBase.articles.push(newArticle); 
  topic.addArticle(newArticle.id);

  res.status(200).json(newArticle);
});

export default router;
