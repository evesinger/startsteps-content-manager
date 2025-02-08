import express, { Request, Response } from "express";
import { TopicRepository } from "../repositories/TopicRepository";
import sql from "../configs/dbconfig";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: { authorId: string; role: string };
}

/* Create a new topic (Only Chiefs) */
router.post(
  "/",
  roleMiddleware("CHIEF_EDITOR"),
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, description } = req.body;
    const chiefEditorId = Number(req.user?.authorId);

    console.log("Incoming Request:");
    console.log("  ➜ Title:", title || "MISSING");
    console.log("  ➜ Description:", description || "MISSING");
    console.log("  ➜ Chief Editor ID:", chiefEditorId || "MISSING");

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!chiefEditorId) {
      return res.status(400).json({ error: "Invalid chief editor ID" });
    }

    try {
      const newTopic = await TopicRepository.create(title, description, chiefEditorId);

      if (newTopic.error) {
        return res.status(400).json({ error: newTopic.error });
      }

      console.log("Topic Created:", newTopic);

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
        VALUES (${newTopic.id}, 'Topic', ${chiefEditorId}, 'CREATE', NOW());
      `;

      res.status(201).json(newTopic);
    } catch (error: unknown) {
      console.error("Error creating topic:", error);

      let errorMessage = "Unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else {
        try {
          errorMessage = JSON.stringify(error);
        } catch {
          errorMessage = "Unknown error (could not be serialized)";
        }
      }

      res.status(500).json({ error: "Failed to create topic", details: errorMessage });
    }
  }
);




/* Get all topics (Authors and Chiefs can view) */
router.get("/", async (req: Request, res: Response) => {
  try {
    const topics = await TopicRepository.findAll();
    res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

/* Update a topic by ID (Only Chiefs) */
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
      const existingTopic = await TopicRepository.findById(Number(id));
      if (!existingTopic) {
        return res.status(404).json({ error: "Topic not found" });
      }

      const updatedTopic = await TopicRepository.update(Number(id), title, description);

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
        VALUES (${updatedTopic.id}, 'Topic', ${chiefEditorId}, 'UPDATE', NOW());
      `;

      res.status(200).json(updatedTopic);
    } catch (error) {
      console.error("Error updating topic:", error);
      res.status(500).json({ error: "Failed to update topic" });
    }
  }
);

/* Get a specific topic by ID (Anyone can view, includes articles) */
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const topic = await TopicRepository.findById(Number(id));
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const articles = await TopicRepository.getArticlesForTopic(Number(id));

    res.status(200).json({
      ...topic,
      articles,
    });
  } catch (error) {
    console.error("Error fetching topic with articles:", error);
    res.status(500).json({ error: "Failed to fetch topic with articles" });
  }
});

/* Delete a topic by ID (Only Chief Editors) */
router.delete(
  "/:id",
  roleMiddleware("CHIEF_EDITOR"),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const chiefEditorId = Number(req.user?.authorId);

    try {
      const existingTopic = await TopicRepository.findById(Number(id));
      if (!existingTopic) {
        return res.status(404).json({ error: "Topic not found" });
      }

      await TopicRepository.softDelete(Number(id));

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
        VALUES (${id}, 'Topic', ${chiefEditorId}, 'DELETE', NOW());
      `;

      res.status(200).json({ message: "Topic deleted successfully" });
    } catch (error) {
      console.error("Error deleting topic:", error);
      res.status(500).json({ error: "Failed to delete topic" });
    }
  }
);

/* Link articles to a topic (Authors and Chiefs) */
router.put(
  "/:id/articles/:articleId",
  roleMiddleware(),
  async (req: AuthenticatedRequest, res: Response) => {
    const { id, articleId } = req.params;
    const authorId = req.user?.authorId;

    if (!authorId) {
      return res.status(403).json({ error: "Unauthorized: Author ID is missing." });
    }

    try {
      const linked = await TopicRepository.linkArticleToTopic(Number(id), Number(articleId), Number(authorId));

      if (!linked) {
        return res.status(403).json({ error: "You can only link your own articles to a topic" });
      }

      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
        VALUES (${id}, 'Topic', ${authorId}, 'LINK_ARTICLE', NOW());
      `;

      res.status(200).json({ message: "Article linked to topic successfully" });
    } catch (error) {
      console.error("Error linking article to topic:", error);
      res.status(500).json({ error: "Failed to link article to topic" });
    }
  }
);

export default router;
