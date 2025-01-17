import sql from "../configs/dbconfig";

export class ArticleRepository {
  static async findAll() {
    return await sql`
      SELECT id, title, author, text, image, created_at, topic_id 
      FROM articles;
    `;
  }

  static async findById(id: number) {
    const [article] = await sql`
      SELECT id, title, author, text, image, created_at, topic_id 
      FROM articles 
      WHERE id = ${id};
    `;
    return article;
  }

  static async create(title: string, author: string, text: string, image: string, topicId: number) {
    const [newArticle] = await sql`
      INSERT INTO articles (title, author, text, image, topic_id, created_at)
      VALUES (${title}, ${author}, ${text}, ${image}, ${topicId}, DEFAULT)
      RETURNING *;
    `;
    return newArticle;
  }

  // Updated to support dynamic updates
  static async update(id: number, data: Record<string, string | number>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
  
    if (keys.length === 0) {
      throw new Error("No fields to update");
    }
  
    // Dynamically construct the SET clause
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  
    // Add the ID to the list of values
    values.push(id);
  
    // Execute the query
    const query = `
      UPDATE articles
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;
  
    const [updatedArticle] = await sql.unsafe(query, values);
    return updatedArticle;
  }
  
  static async delete(id: number) {
    await sql`
      DELETE FROM articles 
      WHERE id = ${id};
    `;
  }
  
}
