import express, { Request, Response } from 'express';
import { ArticleRespository } from '../repositories/ArticleRepository';
const router = express.Router();

// Get all articles
router.get('/', async (req: Request, res: Response) => {
  try {
    const articles = await ArticleRespository.findAll();
    res.status(200).json(articles);
  } catch (err) {
    console.error("Error in GET /articles:", err); 
    res.status(500).json({ error: "Failed to retrieve articles" });
  }
});

// Get a specific article by its articleID
router.get('/:articleId(\\d+)', async (req: Request, res: Response) => {
  const articleId = parseInt(req.params.articleId);

  if (isNaN(articleId)) {
    return res.status(400).json({ error: "Invalid articleId. It must be a number." });
  }

  try {
    const article = await ArticleRespository.findById(articleId);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve the article" });
  }
});


// Update an article by its ID
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
    const article = await ArticleRespository.findById(articleId);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    await ArticleRespository.update(articleId, title, author, text);
    const updatedArticle = await ArticleRespository.findById(articleId);

    res.json(updatedArticle);
  } catch (err) {
    res.status(500).json({ error: "Failed to update the article" });
  }
});

// Delete an article by its ID
router.delete('/:articleId',  async (req: Request, res: Response) => {
  const articleId = parseInt(req.params.articleId);

  if (isNaN(articleId)) {
    return res.status(400).json({ error: "Invalid articleId. It must be a number." });
  }

  try {
    const article = await ArticleRespository.findById(articleId);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    await ArticleRespository.delete(articleId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete the article" });
  }
});

  //Getting latest articles
router.get('/latest', async (req: Request, res: Response) => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour in milliseconds
    const articles = await ArticleRespository.findLatest(oneHourAgo);

    res.status(200).json(articles.slice(0, 10));
  } catch (err) {
    console.error("Error in GET /latest:", err);
    res.status(500).json({ error: "Failed to retrieve the latest articles" });
  }
});



  // Create a new article withouth linking to a topic
router.post('/', async (req: Request, res: Response) => {
  const { title, author, text } = req.body;

  if (!title || !author || !text) {
    return res.status(400).json({ error: "Title, Author, and Text are required" });
  }

  try {
  const newArticle = await ArticleRespository.create(title, author, text);
  res.status(201).json(newArticle);
} catch (err) {
  res.status(500).json({ error: "Failed to create article" });
}
});

export default router;




