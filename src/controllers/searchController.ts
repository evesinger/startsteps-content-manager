import express, { Request, Response } from 'express';
import sql from '../configs/dbconfig';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { query } = req.query; // Extract query parameter
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const results = await sql`
      SELECT * 
      FROM articles
      WHERE title ILIKE ${'%' + query + '%'} OR text ILIKE ${'%' + query + '%'};
    `;
    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({ error: 'Failed to search articles' });
  }
});

export default router;
