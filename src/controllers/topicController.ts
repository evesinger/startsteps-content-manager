import express, { Request, Response } from 'express';
import { TopicRepository } from '../repositories/TopicRepository';
import { ArticleRespository } from '../repositories/ArticleRepository';

const router = express.Router();

// ENDPOINT 1. Create a new topic
router.post('/', async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const newTopic = await TopicRepository.create(title);
    res.status(200).json(newTopic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// ENDPOINT 2. Delete a topic
router.delete('/:topicId', async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  try {
    const topic = await TopicRepository.findById(topicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    await TopicRepository.delete(topicId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

// ENDPOINT 3. List all topics
router.get('/', async (_req: Request, res: Response) => {
  try {
    const topics = await TopicRepository.findAll();
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// ENDPOINT 4. Show a specific topic
router.get('/:topicId', async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  try {
    const topic = await TopicRepository.findById(topicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    res.status(200).json(topic);
  } catch (error) {
    console.error('Error fetching topic:', error);
    res.status(500).json({ error: 'Failed to fetch topic' });
  }
});

// ENDPOINT 5. Get all articles for a specific topic
router.get('/:topicId/articles', async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  try {
    const topic = await TopicRepository.findById(topicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const articles = await TopicRepository.getArticlesForTopic(topicId);
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles for topic:', error);
    res.status(500).json({ error: 'Failed to fetch articles for topic' });
  }
});

// ENDPOINT 6. Update a topic (link existing articles)
router.put('/:topicId', async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  const { articleIds } = req.body;

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  if (!articleIds || !Array.isArray(articleIds)) {
    return res.status(400).json({ error: "Article IDs must be provided as an array." });
  }

  try {
    const topic = await TopicRepository.findById(topicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const invalidArticles = [];
    for (const articleId of articleIds) {
      const article = await ArticleRespository.findById(articleId);
      if (!article) {
        invalidArticles.push(articleId);
      }
    }

    if (invalidArticles.length > 0) {
      return res.status(404).json({ error: `Articles with IDs ${invalidArticles.join(', ')} not found.` });
    }

    await TopicRepository.addArticlesToTopic(topicId, articleIds);
    res.status(200).json({ message: "Articles linked to topic successfully." });
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: 'Failed to update topic' });
  }
});

// ENDPOINT 7. Create a new article linked to a specific topic
router.post('/:topicId/articles', async (req: Request, res: Response) => {
  const topicId = parseInt(req.params.topicId);
  const { title, author, text } = req.body;

  if (isNaN(topicId)) {
    return res.status(400).json({ error: "Invalid topicId. It must be a number." });
  }

  if (!title || !author || !text) {
    return res.status(400).json({ error: "Title, Author, and Text are required." });
  }

  try {
    const topic = await TopicRepository.findById(topicId);
    if (!topic) {
      return res.status(404).json({ error: "Topic not found." });
    }

    const newArticle = await ArticleRespository.create(title, author, text);
    await TopicRepository.addArticlesToTopic(topicId, [newArticle.id]);

    res.status(200).json(newArticle);
  } catch (error) {
    console.error('Error creating article for topic:', error);
    res.status(500).json({ error: 'Failed to create article for topic.' });
  }
});

export default router;
