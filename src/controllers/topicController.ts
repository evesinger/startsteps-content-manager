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
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await sql`
      INSERT INTO topics (title, description)
      VALUES (${title}, ${description || null})
      RETURNING *;
    `;
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


 //Update a topic by ID
router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await sql`
      UPDATE topics
      SET title = ${title}, description = ${description || null}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (!result.length) {
      return res.status(404).json({ error: "Topic not found" });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error updating topic:", error);
    res.status(500).json({ error: "Failed to update topic" });
  }
});


// Get a specific topic by ID, including its articles
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Fetch the topic
    const topic = await sql`SELECT * FROM topics WHERE id = ${id}`;
    if (!topic.length) {
      return res.status(404).json({ error: "Topic not found" });
    }

    // Fetch articles linked to the topic
    const articles = await sql`
      SELECT * 
      FROM articles 
      WHERE topic_id = ${id};
    `;

    // Return the topic along with its articles
    res.status(200).json({
      ...topic[0],
      articles, // Include related articles in the response
    });
  } catch (error) {
    console.error("Error fetching topic with articles:", error);
    res.status(500).json({ error: "Failed to fetch topic with articles" });
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

    // Link each article to the topic by updating the topic_id
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
});


export default router;
