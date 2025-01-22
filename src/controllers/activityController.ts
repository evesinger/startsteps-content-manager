import { Request, Response, Router } from 'express';
import sql from '../configs/dbconfig';

const router = Router();

// Get all activity logs
router.get('/', async (req: Request, res: Response) => {
  try {
    const logs = await sql`
      SELECT *
      FROM activitylog
      ORDER BY timestamp DESC
      LIMIT 20; -- Limit to recent 20 activities
    `;
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs.' });
  }
});

export default router;
