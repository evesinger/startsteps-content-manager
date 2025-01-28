import express, { Request, Response } from 'express';
import { ArticleRepository } from '../repositories/ArticleRepository';
import sql from '../configs/dbconfig';
const router = express.Router();

// Get all articles
router.get("/", async (_req: Request, res: Response) => {
  try {
    const articles = await ArticleRepository.findAll();
    res.status(200).json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// Get an article by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const article = await ArticleRepository.findById(Number(id));
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

// Create an article
router.post("/", async (req: Request, res: Response) => {
  const { title, author, text, image, topicId } = req.body;

  if (!title || !author || !text || !image || !topicId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newArticle = await ArticleRepository.create(
      title,
      author,
      text,
      image,
      topicId
    );

    await sql`
    INSERT INTO activitylog (type, entity_id, entity_name, action)
    VALUES ('Article', ${newArticle.id}, ${newArticle.title}, 'CREATE');
  `;
  
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Failed to create article" });
  }
});

// Update an article
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, author, text, image } = req.body;

  // Ensure at least one field is provided for an update
  if (!title && !author && !text && !image) {
    return res.status(400).json({ error: "At least one field is required to update" });
  }

  try {
    // Prepare an update object dynamically
    const updateData: Record<string, string> = {};
    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (text) updateData.text = text;
    if (image) updateData.image = image;

    const updatedArticle = await ArticleRepository.update(Number(id), updateData);

    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }
    await sql`
    INSERT INTO activitylog (type, entity_id, entity_name, action)
    VALUES ('Article', ${updatedArticle.id}, ${updatedArticle.title}, 'UPDATE');
  `;

    res.status(200).json({ message: "Article updated successfully", updatedArticle });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Failed to update article" });
  }
});

//Delete Article
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const article = await ArticleRepository.findById(Number(id)); // Check if the article exists
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    await ArticleRepository.delete(Number(id));
    await sql`
    INSERT INTO activitylog (type, entity_id, entity_name, action)
    VALUES ('Article', ${article.id}, ${article.title}, 'DELETE');
  `;
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Failed to delete article" });
  }
});

export default router;
