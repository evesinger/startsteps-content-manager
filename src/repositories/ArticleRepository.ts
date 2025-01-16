import { initDatabase } from '../database/database';
import { Article } from '../classes/Article';

export const ArticleRepository = {
  async create(title: string, author: string, text: string): Promise<Article> {
    const db = await initDatabase();
    const result = await db.run(
      'INSERT INTO articles (title, author, text, created_at) VALUES (?, ?, ?, ?)',
      title, author, text, new Date()
    );
    const articleId = result.lastID; // Get the ID of the newly created article
    return new Article(title, author, text, new Date());
  },

  async findById(id: number): Promise<Article | null> {
    const db = await initDatabase();
    const row = await db.get('SELECT * FROM articles WHERE id = ?', id);
    return row ? new Article(row.title, row.author, row.text, new Date(row.created_at)) : null;
  },

  async findAll(): Promise<Article[]> {
    const db = await initDatabase();
    const rows = await db.all('SELECT * FROM articles');
    return rows.map(row => new Article(row.title, row.author, row.text, new Date(row.created_at)));
  },

  async update(id: number, title: string, author: string, text: string): Promise<void> {
    const db = await initDatabase();
    await db.run(
      'UPDATE articles SET title = ?, author = ?, text = ? WHERE id = ?',
      title, author, text, id
    );
  },

  async delete(id: number): Promise<void> {
    const db = await initDatabase();
    await db.run('DELETE FROM articles WHERE id = ?', id);
  },

};
