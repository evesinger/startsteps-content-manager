import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

const dbPath = path.resolve(__dirname, 'database.sqlite');

export const initDatabase = async (useMemory: boolean = false): Promise<Database> => {
    const db = await open({
      filename: useMemory ? ':memory:' : 'path/to/your/database.sqlite', // Replace with the actual path
      driver: sqlite3.Database,
    });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL UNIQUE
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS topic_articles (
      topic_id INTEGER,
      article_id INTEGER,
      PRIMARY KEY (topic_id, article_id),
      FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
      FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    );
  `);

  return db;
};
