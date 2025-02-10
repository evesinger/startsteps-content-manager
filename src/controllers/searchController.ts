import express, { Request, Response } from "express";
import sql from "../configs/dbconfig";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: { authorId: number; role: string };
}

//   Search Endpoint (Accessible by both CHIEF_EDITOR and AUTHOR)
router.get(
  "/",
  roleMiddleware(["AUTHOR", "CHIEF_EDITOR"]),
  async (req: AuthenticatedRequest, res: Response) => {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    try {
      //   Search in Articles
      const articles = await sql`
      SELECT id, title, text, 'article' AS type
      FROM articles
      WHERE title ILIKE ${"%" + query + "%"} OR text ILIKE ${"%" + query + "%"};
    `;

      //   Search in Topics
      const topics = await sql`
      SELECT id, title, description, 'topic' AS type
      FROM topics
      WHERE title ILIKE ${"%" + query + "%"} OR description ILIKE ${"%" + query + "%"};
    `;

      //   Search in Authors by name
      const authors = await sql`
      SELECT id, first_name, last_name, introduction, 'author' AS type
      FROM authors
      WHERE first_name ILIKE ${"%" + query + "%"}
         OR last_name ILIKE ${"%" + query + "%"};
    `;

      //   Combine Results
      const results = [...articles, ...topics, ...authors];

      res.status(200).json(results);
    } catch (error) {
      console.error("Error searching:", error);
      res
        .status(500)
        .json({ error: "Failed to search articles, topics, and authors" });
    }
  },
);

export default router;
