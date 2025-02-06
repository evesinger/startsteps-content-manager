import express, { Request, Response } from "express";
import { ArticleRepository } from "../repositories/ArticleRepository";
import sql from "../configs/dbconfig";
import { roleMiddleware } from "../middlewares/roleMiddleware"; // ✅ Import Role Middleware

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: { authorId: string; role: string };
}

/**
 * ✅ Get all articles (or filter by author_id)
 * - Authors see only their own articles.
 * - Chief Editors can see all articles.
 */
router.get(
  "/",
  roleMiddleware(), // ✅ Any authenticated user can access
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { author_id } = req.query;
      const userRole = req.user?.role;
      const userId = Number(req.user?.authorId);

      let articles;
      if (userRole === "AUTHOR" && author_id && Number(author_id) !== userId) {
        return res
          .status(403)
          .json({ error: "Access denied: You can only view your own articles." });
      }

      if (userRole === "CHIEF_EDITOR") {
        articles = await sql`SELECT * FROM articles`; // ✅ Chief Editors see all articles
      } else {
        articles = await sql`SELECT * FROM articles WHERE author_id = ${userId}`;
      }

      res.status(200).json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  }
);

/**
 * ✅ Get a single article
 * - Authors see only their own articles.
 * - Chief Editors can view any article.
 */
router.get(
  "/:id",
  roleMiddleware(),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userRole = req.user?.role;
    const userId = Number(req.user?.authorId);

    try {
      const article = await ArticleRepository.findById(Number(id));
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      if (userRole === "AUTHOR" && article.author_id !== userId) {
        return res
          .status(403)
          .json({ error: "Access denied: You can only view your own articles." });
      }

      res.status(200).json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  }
);

/**
 * ✅ Create an article (Only Chief Editors)
 */
router.post(
  "/",
  roleMiddleware("CHIEF_EDITOR"),
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, text, image, topic_id, author_id } = req.body;
    const chiefEditorId = Number(req.user?.authorId);

    if (!chiefEditorId) {
      return res.status(401).json({ error: "Unauthorized: Missing Chief Editor credentials" });
    }

    if (!title || !text || !image || !topic_id || !author_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const topic = await sql`SELECT * FROM topics WHERE id = ${topic_id}`;
      if (!topic.length) {
        return res.status(400).json({ error: "Invalid topic ID" });
      }

      const [newArticle] = await sql`
        INSERT INTO articles (title, author_id, created_by, text, image, views, created_at, topic_id)
        VALUES (${title}, ${author_id}, ${chiefEditorId}, ${text}, ${image}, 0, NOW(), ${topic_id})
        RETURNING *;
      `;

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
        VALUES (${newArticle.id}, 'Article', ${chiefEditorId}, 'CREATE', NOW());
      `;

      res.status(201).json(newArticle);
    } catch (error) {
      console.error("❌ Error creating article:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  }
);

/**
 * ✅ Update an article
 * - Authors can update only their own articles.
 * - Chief Editors can update any article.
 */
router.put(
  "/:id",
  roleMiddleware(),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { title, text, image } = req.body;
    const userRole = req.user?.role;
    const userId = Number(req.user?.authorId);

    if (!title && !text && !image) {
      return res.status(400).json({ error: "At least one field is required to update" });
    }

    try {
      const article = await ArticleRepository.findById(Number(id));
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      if (userRole === "AUTHOR" && article.author_id !== userId) {
        return res
          .status(403)
          .json({ error: "Access denied: You can only edit your own articles." });
      }

      const updateData: Record<string, string | number> = {};
      if (title) updateData.title = title;
      if (text) updateData.text = text;
      if (image) updateData.image = image;

      const updatedArticle = await ArticleRepository.update(Number(id), updateData);

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, updated_at)
        VALUES (${updatedArticle.id}, 'Article', ${userId}, 'UPDATE', NOW());
      `;

      res.status(200).json({ message: "Article updated successfully", updatedArticle });
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  }
);

/**
 * ✅ Delete an article (Soft Delete)
 * - Authors can delete only their own articles.
 * - Chief Editors can delete any article.
 */
router.delete(
  "/:id",
  roleMiddleware(),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userRole = req.user?.role;
    const userId = Number(req.user?.authorId);

    try {
      const article = await ArticleRepository.findById(Number(id));
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      if (userRole === "AUTHOR" && article.author_id !== userId) {
        return res
          .status(403)
          .json({ error: "Access denied: You can only delete your own articles." });
      }

      await sql`
        UPDATE articles SET deleted_at = NOW() WHERE id = ${id};
      `;

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, deleted_at)
        VALUES (${id}, 'Article', ${userId}, 'DELETE', NOW());
      `;

      res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  }
);

export default router;
