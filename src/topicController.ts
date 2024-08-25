import express, { Request, Response } from 'express';
import { dummyDataBase } from './dummyDataBase';
import { Topic } from './Topic';

const router = express.Router();

// List all topics
router.get('/', (req: Request, res: Response) => {
  res.json(dummyDataBase.topics);
});

// Show a specific topic by ID
router.get('/:id', (req: Request, res: Response) => {
  const topicId = parseInt(req.params.id);
  const topic = dummyDataBase.topics.find(t => t.id === topicId);

  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }

  res.json({ id: topic.id, title: topic.title });
});

// Create a new topic
router.post('/', (req: Request, res: Response) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Topic title is required" });
  }

  const newTopic = new Topic(title);
  dummyDataBase.topics.push(newTopic);
  res.status(201).json(newTopic);
});

export default router;
