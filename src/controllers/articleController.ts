import express, { Request, Response } from 'express';
import { ArticleRepository } from '../repositories/ArticleRepository';
import sql from '../configs/dbconfig';

const router = express.Router();

// Get all articles
// Get all articles (OR filter by author_id)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { author_id } = req.query; // Extract `author_id` from query parameters

    let articles;
    if (author_id) {
      console.log(`Fetching articles for author ID: ${author_id}`);
      articles = await sql`SELECT * FROM articles WHERE author_id = ${Number(author_id)}`; // ✅ Filter articles by author_id
    } else {
      articles = await sql`SELECT * FROM articles`; // ✅ If no author_id, return all articles
    }

    res.status(200).json(articles);
  } catch (error: any) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: error.message || "Failed to fetch articles" });
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
  } catch (error: any) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: error.message || "Failed to fetch article" });
  }
});

// Create an article
router.post("/", async (req: Request, res: Response) => {
  const { title, text, image, topic_id, author_id } = req.body;

  if (!title || !text || !image || !topic_id || !author_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Validate author and topic exist
    const author = await sql`SELECT * FROM authors WHERE id = ${author_id}`;
    if (!author.length) {
      return res.status(400).json({ error: "Invalid author ID" });
    }

    const topic = await sql`SELECT * FROM topics WHERE id = ${topic_id}`;
    if (!topic.length) {
      return res.status(400).json({ error: "Invalid topic ID" });
    }

    const newArticle = await ArticleRepository.create(
      title,
      author_id,
      text,
      image,
      topic_id
    );

    await sql`
      INSERT INTO activity_log (type, entity_id, entity_name, action, author_id)
      VALUES ('Article', ${newArticle.id}, ${newArticle.title}, 'CREATE', ${author_id});
    `;

    res.status(201).json(newArticle);
  } catch (error: any) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: error.message || "Failed to create article" });
  }
});

// Update an article
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, author_id, text, image } = req.body;

  if (!author_id) {
    return res.status(400).json({ error: "Author ID is required" });
  }

  if (!title && !text && !image) {
    return res.status(400).json({ error: "At least one field is required to update" });
  }

  try {
    const article = await ArticleRepository.findById(Number(id));

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Ensure only the article's author can modify it
    if (article.author_id !== author_id) {
      return res.status(403).json({ error: "You can only edit your own articles" });
    }

    const updateData: Record<string, string> = {};
    if (title) updateData.title = title;
    if (text) updateData.text = text;
    if (image) updateData.image = image;

    const updatedArticle = await ArticleRepository.update(Number(id), updateData);

    await sql`
      INSERT INTO activity_log (type, entity_id, entity_name, action)
      VALUES ('Article', ${updatedArticle.id}, ${updatedArticle.title}, 'UPDATE');
    `;

    res.status(200).json({ message: "Article updated successfully", updatedArticle });
  } catch (error: any) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: error.message || "Failed to update article" });
  }
});

// Delete an article
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { author_id } = req.body;

  if (!author_id) {
    return res.status(400).json({ error: "Author ID is required" });
  }

  try {
    const article = await ArticleRepository.findById(Number(id));

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    // Ensure only the article's author can delete it
    if (article.author_id !== author_id) {
      return res.status(403).json({ error: "You can only delete your own articles" });
    }

    await ArticleRepository.delete(Number(id));

    await sql`
      INSERT INTO activity_log (type, entity_id, entity_name, action)
      VALUES ('Article', ${article.id}, ${article.title}, 'DELETE');
    `;

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: error.message || "Failed to delete article" });
  }
});

export default router;
