import sql from "../configs/dbconfig";

export class ArticleRepository {
  static async findAll() {
    return await sql`
      SELECT id, title, author_id, text, image, created_at, topic_id, views 
      FROM articles;
    `;
  }

  static async findById(id: number) {
    const [article] = await sql`
      SELECT id, title, author_id, text, image, created_at, topic_id, views 
      FROM articles 
      WHERE id = ${id};
    `;
    return article;
  }

  static async findByAuthorId(authorId: number) {
    return await sql`SELECT * FROM articles WHERE author_id = ${authorId}`;
  }

  // With random views for stats
  static async create(
    title: string,
    authorId: number, //now expercting a num
    text: string,
    image: string,
    topicId: number
  ) {
    // 0 views initially
    const [newArticle] = await sql`
    INSERT INTO articles (title, author_id, text, image, topic_id, created_at, views)
    VALUES (${title}, ${authorId}, ${text}, ${image}, ${topicId}, NOW(), 0) -- ✅ Explicitly setting created_at
    RETURNING *;
    `;
  
    //update views after 5 seconds to show on demo
    setTimeout(async () => {
      try {
        const randomViews = Math.floor(Math.random() * (1000 - 50 + 1)) + 50;
  
        await sql`
          UPDATE articles
          SET views = ${randomViews}
          WHERE id = ${newArticle.id};
        `;
        console.log(
          `Views updated to ${randomViews} for article ID: ${newArticle.id}`
        );
      } catch (error) {
        console.error(`Error updating views for article ID: ${newArticle.id}`, error);
      }
    }, 5000);
  
    return newArticle;
  }
  
  

  static async update(id: number, data: Record<string, string | number>) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    if (keys.length === 0) {
      throw new Error("No fields to update");
    }

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

    values.push(id);

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
    // First, update `deleted_at` before deleting
    await sql`
      UPDATE articles 
      SET deleted_at = NOW() 
      WHERE id = ${id};
    `;
  
    // Then, permanently delete the article
    await sql`
      DELETE FROM articles 
      WHERE id = ${id};
    `;
  }
  
}
