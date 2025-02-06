import { Request, Response, Router } from "express";
import sql from "../configs/dbconfig";
import { roleMiddleware } from "../middlewares/roleMiddleware";

const router = Router();

// ✅ Route for Chief Editors to View All Logs
router.get("/", roleMiddleware("chief_editor"), async (req: Request, res: Response) => {
  try {
    const logs = await sql`
      SELECT id, type, entity_id, author_id, action, created_at, updated_at, deleted_at
      FROM activity_log
      ORDER BY created_at DESC
      LIMIT 20;
    `;
    res.status(200).json(logs);
  } catch (error) {
    console.error("❌ Error fetching activity logs:", error);
    res.status(500).json({ error: "Failed to fetch activity logs." });
  }
});

// ✅ Route for Authors to View Only Their Own Logs
router.get("/my-logs", async (req: Request, res: Response) => {
  const { author_id } = req.query; // Extract `author_id` from query params

  if (!author_id) {
    return res.status(400).json({ error: "author_id is required" });
  }

  try {
    console.log(`Fetching activity logs for author ID: ${author_id}`);

    const logs = await sql`
      SELECT * FROM activity_log WHERE author_id = ${Number(author_id)}
    `;

    res.status(200).json(logs);
  } catch (error) {
    console.error("❌ Error fetching activity logs:", error);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

export default router;
