import { initDatabase } from '../database/database';
import { Article } from '../classes/Article';

export const ArticleRepository = {
  async create(title: string, authorId: number, text: string): Promise<Article> {
    const db = await initDatabase();

    const author = await db.get('SELECT * FROM authors WHERE id = ?', authorId);

    if (!author) {
      throw new Error('Author not found');
    }

    const result = await db.run(
      'INSERT INTO articles (title, author_id, text, created_at) VALUES (?, ?, ?, ?)',
      title, authorId, text, new Date()
    );

    const articleId = result.lastID;
    return new Article(title, author, text, new Date());
  },

  async findById(id: number): Promise<Article | null> {
    const db = await initDatabase();
    const row = await db.get('SELECT * FROM articles WHERE id = ?', id);

    if (!row) return null;

    const author = await db.get('SELECT * FROM authors WHERE id = ?', row.author_id);

    return new Article(row.title, author, row.text, new Date(row.created_at));
  },

  async findAll(): Promise<Article[]> {
    const db = await initDatabase();
    const rows = await db.all('SELECT * FROM articles');

    const articles = await Promise.all(
      rows.map(async (row) => {
        const author = await db.get('SELECT * FROM authors WHERE id = ?', row.author_id);
        return new Article(row.title, author, row.text, new Date(row.created_at));
      })
    );

    return articles;
  },

  async update(id: number, title: string, authorId: number, text: string): Promise<void> {
    const db = await initDatabase();
    const author = await db.get('SELECT * FROM authors WHERE id = ?', authorId);
    if (!author) {
      throw new Error('Author not found');
    }

    await db.run(
      'UPDATE articles SET title = ?, author_id = ?, text = ? WHERE id = ?',
      title, authorId, text, id
    );
  },

  async delete(id: number): Promise<void> {
    const db = await initDatabase();
    await db.run('DELETE FROM articles WHERE id = ?', id);
  },
};
