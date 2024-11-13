import express, { Request, Response } from 'express';
import { ArticleRepository } from '../repositories/ArticleRepository';
const router = express.Router();

// ENDPOINT 1. Get all articles, optionally filtered by topicId
router.get('/', async (req: Request, res: Response) => {
  try {
    const articles = await ArticleRepository.findAll();
    res.status(200).json(articles);
  } catch (err) {
    console.error("Error in GET /articles:", err); // Log the error for debugging
    res.status(500).json({ error: "Failed to retrieve articles" });
  }
});

// ENDPOINT 2. Get a specific article by its articleID

router.get('/:articleId(\\d+)', async (req: Request, res: Response) => {
  const articleId = parseInt(req.params.articleId);

  if (isNaN(articleId)) {
    return res.status(400).json({ error: "Invalid articleId. It must be a number." });
  }

  try {
    const article = await ArticleRepository.findById(articleId);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve the article" });
  }
});


// ENDPOINT 3. Update an article by its ID
router.put('/:articleId', async (req: Request, res: Response) => {
  const articleId = parseInt(req.params.articleId);
  const { title, author, text } = req.body;

  if (isNaN(articleId)) {
    return res.status(400).json({ error: "Invalid articleId. It must be a number." });
  }
  if (!title || !author || !text) {
    return res.status(400).json({ error: "Title, Author, and Text are required to update an article." });
  }

  try {
    const article = await ArticleRepository.findById(articleId);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    await ArticleRepository.update(articleId, title, author, text);
    const updatedArticle = await ArticleRepository.findById(articleId);

    res.json(updatedArticle);
  } catch (err) {
    res.status(500).json({ error: "Failed to update the article" });
  }
});

// ENDPOINT 4 Delete an article by its ID
router.delete('/:articleId',  async (req: Request, res: Response) => {
  const articleId = parseInt(req.params.articleId);

  if (isNaN(articleId)) {
    return res.status(400).json({ error: "Invalid articleId. It must be a number." });
  }

  try {
    const article = await ArticleRepository.findById(articleId);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    await ArticleRepository.delete(articleId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete the article" });
  }
});

  // ENDPOINT 5: Getting latest articles
  // router.get('/latest', async (req: Request, res: Response) => {
  //   try {
  //     const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // current time minus 1 hour
  //     const articles = await ArticleRepository.findLatest(oneHourAgo);
  //     res.json(articles.slice(0, 10)); // return up to 10 latest articles
  //   } catch (err) {
  //     res.status(500).json({ error: "Failed to retrieve latest articles" });
  //   }
  // });


  // ENDPOINT 7. Create a new article withouth linking to a topic
router.post('/', async (req: Request, res: Response) => {
  const { title, author, text } = req.body;

  if (!title || !author || !text) {
    return res.status(400).json({ error: "Title, Author, and Text are required" });
  }

  try {
  const newArticle = await ArticleRepository.create(title, author, text);
  res.status(201).json(newArticle);
} catch (err) {
  res.status(500).json({ error: "Failed to create article" });
}
});

export default router;




