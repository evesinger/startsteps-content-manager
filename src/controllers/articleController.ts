import express, { Request, Response } from "express";
import { ArticleRepository } from "../repositories/ArticleRepository";
import sql from "../configs/dbconfig";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: { authorId: string; role: string };
}

/**
 * Get all articles
 * - Authors see only their own articles.
 * - Chief Editors can see all articles.
 */
router.get(
  "/",
  roleMiddleware(),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userRole = req.user?.role;
      const authorId = Number(req.user?.authorId);

      console.log("Authenticated User:", req.user);

      let articles;

      if (userRole === "CHIEF_EDITOR") {
        // Chiefs see ALL articles
        articles = await sql`SELECT * FROM articles`;
      } else if (userRole === "AUTHOR") {
        // Authors see ONLY their own articles
        articles =
          await sql`SELECT * FROM articles WHERE author_id = ${authorId}`;
      } else {
        // else deny access
        return res
          .status(403)
          .json({ error: "Access denied: Insufficient privileges" });
      }

      res.status(200).json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  },
);

/**
 * Get a single article
 * - Authors see only their own articles.
 * - Chief Editors can view any article.
 */
router.get(
  "/:id",
  roleMiddleware(),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userRole = req.user?.role;
    const authorId = Number(req.user?.authorId);

    try {
      const article = await ArticleRepository.findById(Number(id));
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      if (userRole === "AUTHOR" && article.author_id !== authorId) {
        return res
          .status(403)
          .json({
            error: "Access denied: You can only view your own articles.",
          });
      }

      res.status(200).json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  },
);

/**
 * Create an article (Both Chiefs and Authors)
 */
router.post(
  "/",
  roleMiddleware(["AUTHOR", "CHIEF_EDITOR"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, text, image, topic_id, author_id } = req.body;
    const loggedInAuthorId = Number(req.user?.authorId);
    const userRole = req.user?.role;

    console.log(
      `. Creating article as ${userRole}, Author ID: ${loggedInAuthorId}`,
    );

    if (!title || !text || !image || !topic_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // . Authors can only create their own articles
    if (userRole === "AUTHOR" && Number(author_id) !== loggedInAuthorId) {
      return res
        .status(403)
        .json({ error: "Authors can only create their own articles." });
    }

    // . Chief Editors must specify author_id
    if (userRole === "CHIEF_EDITOR" && !author_id) {
      return res
        .status(400)
        .json({ error: "Chief Editors must specify an author_id." });
    }

    try {
      // . Check if topic exists
      const topic = await sql`SELECT * FROM topics WHERE id = ${topic_id}`;
      if (!topic.length) {
        return res.status(400).json({ error: "Invalid topic ID" });
      }

      // . Chief Editors can create for any author, Authors for themselves
      const assignedAuthorId =
        userRole === "CHIEF_EDITOR" ? Number(author_id) : loggedInAuthorId;
      const createdBy = loggedInAuthorId; // Always track who created it

      const [newArticle] = await sql`
        INSERT INTO articles (title, author_id, created_by, text, image, views, created_at, topic_id)
        VALUES (${title}, ${assignedAuthorId}, ${createdBy}, ${text}, ${image}, 0, NOW(), ${topic_id})
        RETURNING *;
      `;

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
        VALUES (${newArticle.id}, 'Article', ${loggedInAuthorId}, 'CREATE', NOW());
      `;

      res.status(201).json(newArticle);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  },
);

/**
 * Update an article
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
    const authorId = Number(req.user?.authorId);

    if (!title && !text && !image) {
      return res
        .status(400)
        .json({ error: "At least one field is required to update" });
    }

    try {
      const article = await ArticleRepository.findById(Number(id));
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      if (userRole === "AUTHOR" && article.author_id !== authorId) {
        return res
          .status(403)
          .json({
            error: "Access denied: You can only edit your own articles.",
          });
      }

      const updateData: Record<string, string | number> = {};
      if (title) updateData.title = title;
      if (text) updateData.text = text;
      if (image) updateData.image = image;

      const updatedArticle = await ArticleRepository.update(
        Number(id),
        updateData,
        authorId,
      );

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, updated_at)
        VALUES (${updatedArticle.id}, 'Article', ${authorId}, 'UPDATE', NOW());
      `;

      res
        .status(200)
        .json({ message: "Article updated successfully", updatedArticle });
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ error: "Failed to update article" });
    }
  },
);

/**
 * Delete an article
 * - Authors can delete only their own articles.
 * - Chief Editors can delete any article.
 */
router.delete(
  "/:id",
  roleMiddleware(),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userRole = req.user?.role;
    const authorId = Number(req.user?.authorId);

    try {
      const article = await ArticleRepository.findById(Number(id));
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      if (userRole === "AUTHOR" && article.author_id !== authorId) {
        return res
          .status(403)
          .json({
            error: "Access denied: You can only delete your own articles.",
          });
      }

      await sql`
        UPDATE articles SET deleted_at = NOW() WHERE id = ${id};
      `;

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, deleted_at)
        VALUES (${id}, 'Article', ${authorId}, 'DELETE', NOW());
      `;

      res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  },
);

export default router;
