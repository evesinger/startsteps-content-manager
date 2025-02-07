import { Request, Response, Router } from "express";
import sql from "../configs/dbconfig";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

router.get("/", roleMiddleware("CHIEF_EDITOR"), async (req: Request, res: Response) => {
  try {
    console.log("📌 Fetching Activity Logs...");

    const { author_id } = req.query; // ✅ Get author filter from query params

    let logs;

    if (author_id) {
      logs = await sql`
        SELECT 
          activity_log.id, 
          activity_log.type, 
          activity_log.entity_id, 
          activity_log.action, 
          activity_log.created_at AS timestamp,
          COALESCE(authors.first_name || ' ' || authors.last_name, 'Unknown Author') AS author_name,
          COALESCE(articles.title, 'Unknown Article') AS article_title
        FROM activity_log
        LEFT JOIN authors ON activity_log.author_id = authors.id
        LEFT JOIN articles ON activity_log.entity_id = articles.id
        WHERE activity_log.author_id = ${Number(author_id)}  -- ✅ Use dynamic parameter safely
        ORDER BY activity_log.created_at DESC
        LIMIT 20;
      `;
      console.log(`📌 Filtering by Author ID: ${author_id}`);
    } else {
      logs = await sql`
        SELECT 
          activity_log.id, 
          activity_log.type, 
          activity_log.entity_id, 
          activity_log.action, 
          activity_log.created_at AS timestamp,
          COALESCE(authors.first_name || ' ' || authors.last_name, 'Unknown Author') AS author_name,
          COALESCE(articles.title, 'Unknown Article') AS article_title
        FROM activity_log
        LEFT JOIN authors ON activity_log.author_id = authors.id
        LEFT JOIN articles ON activity_log.entity_id = articles.id
        ORDER BY activity_log.created_at DESC
        LIMIT 20;
      `;
    }

    console.log("📝 API Response:", logs);
    res.status(200).json(logs);
  } catch (error) {
    console.error("❌ Error fetching activity logs:", error);
    res.status(500).json({ error: "Failed to fetch activity logs." });
  }
});

router.get("/my-logs", async (req: Request, res: Response) => {
  const authorId = req.headers["x-author-id"];

  if (!authorId) {
    return res.status(400).json({ error: "❌ Missing author_id in headers" });
  }

  try {
    const logs = await sql`
      SELECT 
        activity_log.id, 
        activity_log.type, 
        activity_log.entity_id, 
        activity_log.action, 
        activity_log.created_at AS timestamp, 
        COALESCE(articles.title, 'Unknown Article') AS article_title
      FROM activity_log 
      LEFT JOIN articles ON activity_log.entity_id = articles.id
      WHERE activity_log.author_id = ${Number(authorId)}
      ORDER BY activity_log.created_at DESC
      LIMIT 20;
    `;

    console.log("✅ Logs fetched for Author:", logs);
    res.status(200).json(logs);
  } catch (error) {
    console.error("❌ Error fetching activity logs:", error);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});




export default router;
