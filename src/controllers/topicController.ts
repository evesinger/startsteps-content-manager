import express, { Request, Response } from "express";
import sql from "../configs/dbconfig";
import { roleMiddleware } from "../middlewares/roleMiddleware"; // ✅ Import Role Middleware

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: { authorId: string; role: string };
}

router.post(
  "/",
  roleMiddleware("CHIEF_EDITOR"),
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, description } = req.body;
    const chiefEditorId = Number(req.user?.authorId); // ✅ Extract Chief Editor ID

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    try {
      const [newTopic] = await sql`
        INSERT INTO topics (title, description, created_by)
        VALUES (${title}, ${description || null}, ${chiefEditorId})
        RETURNING *;
      `;

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
        VALUES (${newTopic.id}, 'Topic', ${chiefEditorId}, 'CREATE', NOW());
      `;

      res.status(201).json(newTopic);
    } catch (error) {
      console.error("❌ Error creating topic:", error);
      res.status(500).json({ error: "Failed to create topic" });
    }
  }
);


/**
 * ✅ List all topics (Anyone can view)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const topics = await sql`SELECT * FROM topics`;
    res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

/**
 * ✅ Update a topic by ID (Only Chief Editors)
 */
router.put(
  "/:id",
  roleMiddleware("CHIEF_EDITOR"),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const chiefEditorId = Number(req.user?.authorId);

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    try {
      const topic = await sql`SELECT * FROM topics WHERE id = ${id}`;
      if (!topic.length) {
        return res.status(404).json({ error: "Topic not found" });
      }

      const [updatedTopic] = await sql`
        UPDATE topics
        SET title = ${title}, description = ${description || null}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *;
      `;

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, updated_at)
        VALUES (${updatedTopic.id}, 'Topic', ${chiefEditorId}, 'UPDATE', NOW());
      `;

      res.status(200).json(updatedTopic);
    } catch (error) {
      console.error("Error updating topic:", error);
      res.status(500).json({ error: "Failed to update topic" });
    }
  }
);

/**
 * ✅ Get a specific topic by ID (Anyone can view, includes articles)
 */
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const topic = await sql`SELECT * FROM topics WHERE id = ${id}`;
    if (!topic.length) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const articles = await sql`
      SELECT * FROM articles WHERE topic_id = ${id};
    `;

    res.status(200).json({
      ...topic[0],
      articles, // Include related articles
    });
  } catch (error) {
    console.error("Error fetching topic with articles:", error);
    res.status(500).json({ error: "Failed to fetch topic with articles" });
  }
});

/**
 * ✅ Delete a topic by ID (Only Chief Editors - Soft Delete)
 */
router.delete(
  "/:id",
  roleMiddleware("CHIEF_EDITOR"),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const chiefEditorId = Number(req.user?.authorId);

    try {
      const topic = await sql`SELECT * FROM topics WHERE id = ${id}`;
      if (!topic.length) {
        return res.status(404).json({ error: "Topic not found" });
      }

      await sql`
        UPDATE topics SET deleted_at = NOW() WHERE id = ${id};
      `;

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, deleted_at)
        VALUES (${id}, 'Topic', ${chiefEditorId}, 'DELETE', NOW());
      `;

      res.status(200).json({ message: "Topic deleted successfully" });
    } catch (error) {
      console.error("Error deleting topic:", error);
      res.status(500).json({ error: "Failed to delete topic" });
    }
  }
);

/**
 * ✅ Link articles to a topic (Only Chief Editors)
 */
router.put(
  "/:id/articles",
  roleMiddleware("CHIEF_EDITOR"),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { articleIds } = req.body;

    if (!Array.isArray(articleIds) || articleIds.length === 0) {
      return res.status(400).json({ error: "Article IDs must be provided as a non-empty array" });
    }

    try {
      const topic = await sql`SELECT * FROM topics WHERE id = ${id}`;
      if (!topic.length) {
        return res.status(404).json({ error: "Topic not found" });
      }

      const queries = articleIds.map((articleId) =>
        sql`
          UPDATE articles
          SET topic_id = ${id}
          WHERE id = ${articleId};
        `
      );
      await Promise.all(queries);

      res.status(200).json({ message: "Articles linked to topic successfully" });
    } catch (error) {
      console.error("Error linking articles to topic:", error);
      res.status(500).json({ error: "Failed to link articles to topic" });
    }
  }
);

export default router;
