import { Request, Response, Router } from 'express';
import sql from '../configs/dbconfig';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const logs = await sql`
      SELECT id, type, entity_id, entity_name, author_id, author_name, action, timestamp
      FROM activity_log
      ORDER BY timestamp DESC
      LIMIT 20;
    `;
    res.status(200).json(logs);
  } catch (error) {
    console.error(' Error fetching activity logs:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs.' });
  }
})

router.get("/", async (req: Request, res: Response) => {
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
  } catch (error: any) {
    console.error("❌ Error fetching activity logs:", error);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

export default router;

