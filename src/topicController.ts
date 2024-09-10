import express, { Request, Response } from 'express';
import { dummyDataBase, hardCodedDate } from './dummyDataBase';
import { Article } from './Article';
import { Topic } from './Topic';

const router = express.Router();

/* TOPIC end-points:
- Create a new topic
- Delete a topic
- List all topics
- Show a specific topic
- Create an article for a specific topic
*/

//ADDED: 1. Create a new topic
router.post('/topics', (req: Request, res: Response) => {
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

  res.status(201).json(newTopic);
});

// ADDED: 2. Delete a topic
router.delete('/topics/:topicId', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId, 10);

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  const topicIndex = dummyDataBase.topics.findIndex(t => t.id === topicId);
  if (topicIndex === -1) {
    return res.status(404).json({ error: "Topic not found" });
  }

  dummyDataBase.topics.splice(topicIndex, 1);

  res.status(204).send();
});

// ADDED: 3. List all topics
router.get('/topics', (req: Request, res: Response) => {
  res.json(dummyDataBase.topics);
});

// EDITED: 4. Show a specific topic
router.get('/topics/:topicId', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId, 10);

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  const topic = dummyDataBase.topics.find(t => t.id === topicId);
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  res.json(topic);
});


// 5. Get all articles for a specific topic
router.get('/articles', (req: Request, res: Response) => {
  const topicId = parseInt(req.query.topicId as string, 10);

  // ADDED: checking if topicId is missing or not a valid number
  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }
  const topic = dummyDataBase.topics.find(t => t.id === topicId);
  
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }
  const articles = topic.articleIds.map(id => 
    dummyDataBase.articles.find(article => article.id === id)
  ).filter(article => article !== undefined); // Filter out undefined results

  res.json(articles);
});


// EDITED: 6. Create an article for a specific topic
router.post('/:topicId/articles', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId, 10);

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  const topic = dummyDataBase.topics.find(t => t.id === topicId);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  try {
    const { title, author, text } = req.body;
    
    const newArticle = Article.create(title, author,text, hardCodedDate);

    dummyDataBase.articles.push(newArticle)
    topic.addArticle(newArticle.id); 

    res.status(200).json(newArticle); 
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
});

export default router;
