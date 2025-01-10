import express, { Request, Response } from "express";
import postgres from "postgres";

const sql = postgres({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "newsmanagement_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
});

const router = express.Router();

// Create a new topic
router.post("/", async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await sql`INSERT INTO topics (title) VALUES (${title}) RETURNING *`;
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error creating topic:", error);
    res.status(500).json({ error: "Failed to create topic" });
  }
});

// List all topics
router.get("/", async (req: Request, res: Response) => {
  try {
    const topics = await sql`SELECT * FROM topics`;
    res.status(200).json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

// Get a specific topic by ID
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const topic = await sql`SELECT * FROM topics WHERE id = ${id}`;
    if (!topic.length) {
      return res.status(404).json({ error: "Topic not found" });
    }
    res.status(200).json(topic[0]);
  } catch (error) {
    console.error("Error fetching topic:", error);
    res.status(500).json({ error: "Failed to fetch topic" });
  }
});

// Delete a topic by ID
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await sql`DELETE FROM topics WHERE id = ${id} RETURNING *`;
    if (!result.length) {
      return res.status(404).json({ error: "Topic not found" });
    }
    res.status(200).json({ message: "Topic deleted", topic: result[0] });
  } catch (error) {
    console.error("Error deleting topic:", error);
    res.status(500).json({ error: "Failed to delete topic" });
  }
});

// Link articles to a topic
router.put("/:id/articles", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { articleIds } = req.body;

  if (!Array.isArray(articleIds) || articleIds.length === 0) {
    return res.status(400).json({ error: "Article IDs must be provided as a non-empty array" });
  }

  try {
    // Check if the topic exists
    const topic = await sql`SELECT * FROM topics WHERE id = ${id}`;
    if (!topic.length) {
      return res.status(404).json({ error: "Topic not found" });
    }

    // Link each article to the topic
    const queries = articleIds.map((articleId) =>
      sql`INSERT INTO topic_articles (topic_id, article_id) VALUES (${id}, ${articleId}) ON CONFLICT DO NOTHING`
    );
    await Promise.all(queries);

    res.status(200).json({ message: "Articles linked to topic successfully" });
  } catch (error) {
    console.error("Error linking articles to topic:", error);
    res.status(500).json({ error: "Failed to link articles to topic" });
  }
});

export default router;
