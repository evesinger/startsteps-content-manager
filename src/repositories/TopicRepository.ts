import sql from '../configs/dbconfig';

export class TopicRepository {
  static async create(title: string) {
    const [newTopic] = await sql`
      INSERT INTO topics (title)
      VALUES (${title})
      RETURNING *;
    `;
    return newTopic;
  }

  static async delete(id: number) {
    await sql`DELETE FROM topics WHERE id = ${id};`;
  }

  static async findAll() {
    return await sql`SELECT * FROM topics;`;
  }

  static async findById(id: number) {
    const [topic] = await sql`SELECT * FROM topics WHERE id = ${id};`;
    return topic;
  }

  static async getArticlesForTopic(topicId: number) {
    return await sql`
      SELECT articles.*
      FROM articles
      WHERE articles.topic_id = ${topicId};
    `;
  }

  static async addArticlesToTopic(topicId: number, articleIds: number[]) {
    await Promise.all(
      articleIds.map(articleId =>
        sql`
          UPDATE articles
          SET topic_id = ${topicId}
          WHERE id = ${articleId};
        `
      )
    );
  }
}
