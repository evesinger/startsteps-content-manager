import sql from "../configs/dbconfig";

export class TopicRepository {
  
  static async create(title: string, description: string, chiefEditorId: number) {
    // Ensure all values are defined (PostgreSQL does not allow `undefined`)
    if (!title) {
      throw new Error("Title is required");
    }
    if (!chiefEditorId) {
      throw new Error("Invalid chief editor ID");
    }
  
    // Check if a topic with the same title already exists
    const existingTopic = await sql`
      SELECT * FROM topics WHERE title = ${title} LIMIT 1;
    `;
  
    if (existingTopic.length > 0) {
      return { error: `A topic with the title "${title}" already exists.` };
    }
  
    // ✅ Ensure `description` is `null` instead of `undefined`
    const safeDescription = description ?? null;
  
    // ✅ Ensure `chiefEditorId` is valid
    const safeChiefEditorId = Number(chiefEditorId) || null;
  
    // If no duplicate, insert the new topic
    const [newTopic] = await sql`
      INSERT INTO topics (title, description, created_by)
      VALUES (${title}, ${safeDescription}, ${safeChiefEditorId})
      RETURNING *;
    `;
  
    return newTopic;
  }
  
  
  
  
  static async findAll() {
    return await sql`SELECT * FROM topics WHERE deleted_at IS NULL;`;
  }

  static async findById(id: number) {
    const [topic] = await sql`SELECT * FROM topics WHERE id = ${id} AND deleted_at IS NULL;`;
    return topic;
  }

  static async update(id: number, title: string, description: string) {
    const [updatedTopic] = await sql`
      UPDATE topics
      SET title = ${title}, description = ${description || null}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;
    return updatedTopic;
  }

  static async softDelete(id: number) {
    await sql`UPDATE topics SET deleted_at = NOW() WHERE id = ${id};`;
  }

  static async getArticlesForTopic(topicId: number) {
    return await sql`
      SELECT * FROM articles WHERE topic_id = ${topicId};
    `;
  }

  static async linkArticleToTopic(topicId: number, articleId: number, authorId: number) {
    const [article] = await sql`
      SELECT id FROM articles WHERE id = ${articleId} AND author_id = ${authorId};
    `;
    if (!article) return false;

    await sql`
      UPDATE articles SET topic_id = ${topicId} WHERE id = ${articleId};
    `;
    return true;
  }
}
