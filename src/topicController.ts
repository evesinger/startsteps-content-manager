import express, { Request, Response } from 'express';
import { dummyDataBase, hardCodedDate } from './dummyDataBase';
import { Article } from './Article';
import { Topic } from './Topic';

const router = express.Router();

//ADDED: 1. Create a new topic
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

  res.status(201).json(newTopic);
});

// ADDED: 2. Delete a topic
router.delete('/:topicId', (req: Request, res: Response) => {
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
router.get('/', (req: Request, res: Response) => {
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


// 09.23 5. Get all articles for a specific topic 
router.get('/:topicId/articles', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId, 10);  // using path parameter instead of query parameter

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


// 09.23 EDITED: Update a topic to an articles
router.put('/:topicId', (req: Request, res: Response) => { //added put
  const topicId = parseInt(req.params.topicId, 10);

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  const topic = dummyDataBase.topics.find(t => t.id === topicId);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  try {
    const { articles } = req.body; // expecting a list of articles in the request body
    

    if (!articles || !Array.isArray(articles)) { // making sure req body contains articles array
      return res.status(400).json({ error: "Articles must be provided as an array." });
    }

    articles.forEach(articleData => {
      const { title, author, text } = articleData;
      

      let existingArticle = dummyDataBase.articles.find(article => //check if exist
        article.title === title && article.author === author
      );

      if (!existingArticle) { // if not create a new one 
        existingArticle = Article.create(title, author, text, hardCodedDate);
        dummyDataBase.articles.push(existingArticle);
      }

      if (!topic.articleIds.includes(existingArticle.id)) { // if not added to topic already, add it
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

export default router;
