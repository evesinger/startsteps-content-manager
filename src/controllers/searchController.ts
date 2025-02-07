import express, { Request, Response } from 'express';
import sql from '../configs/dbconfig';
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { query } = req.query; 
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const articles = await sql`
      SELECT *, 'article' AS type
      FROM articles
      WHERE title ILIKE ${'%' + query + '%'} OR text ILIKE ${'%' + query + '%'};
    `;

    const topics = await sql`
      SELECT *, 'topic' AS type
      FROM topics
      WHERE name ILIKE ${'%' + query + '%'} OR description ILIKE ${'%' + query + '%'};
    `;

    // combining results
    const results = [...articles, ...topics];

    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Failed to search articles and topics' });
  }
});


export default router;
