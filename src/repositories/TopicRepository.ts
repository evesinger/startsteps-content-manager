import { initDatabase } from '../database/database';
import { Topic } from '../classes/Topic';

export const TopicRepository = {
  async create(title: string): Promise<Topic> {
    const db = await initDatabase();
    const result = await db.run(
      'INSERT INTO topics (title) VALUES (?)',
      title
    );
    return new Topic(title);
  },

  async findById(id: number): Promise<Topic | null> {
    const db = await initDatabase();
    const row = await db.get('SELECT * FROM topics WHERE id = ?', id);
    return row ? new Topic(row.title) : null;
  },

  async findAll(): Promise<Topic[]> {
    const db = await initDatabase();
    const rows = await db.all('SELECT * FROM topics');
    return rows.map(row => new Topic(row.title));
  },

  async addArticleToTopic(topicId: number, articleId: number): Promise<void> {
    const db = await initDatabase();
    await db.run(
      'INSERT OR IGNORE INTO topic_articles (topic_id, article_id) VALUES (?, ?)',
      topicId, articleId
    );
  },

  async removeArticleFromTopic(topicId: number, articleId: number): Promise<void> {
    const db = await initDatabase();
    await db.run(
      'DELETE FROM topic_articles WHERE topic_id = ? AND article_id = ?',
      topicId, articleId
    );
  },

  async getArticlesForTopic(topicId: number): Promise<number[]> {
    const db = await initDatabase();
    const rows = await db.all('SELECT article_id FROM topic_articles WHERE topic_id = ?', topicId);
    return rows.map(row => row.article_id);
  }
};
