import sql from "../configs/dbconfig";

export class ArticleRepository {
  static async findAll() {
    return await sql`
      SELECT id, title, author_id, text, image, created_at, topic_id, views 
      FROM articles;
    `;
  }

    // Find Article by ID with Validation
    static async findById(articleId: number) {
      console.log("🔍 Fetching article with ID:", articleId);
    
      if (!articleId || isNaN(Number(articleId))) {
        console.error("Invalid article ID:", articleId);
        throw new Error("Invalid article ID: " + articleId);
      }
    
      const [article] = await sql`
        SELECT id, title, author_id, text, image, created_at, topic_id, views 
        FROM articles 
        WHERE id = ${Number(articleId)}; 
      `;
    
      return article;
    }


  // With random views for stats
  static async create(
    title: string,
    authorId: number,
    text: string,
    image: string,
    topicId: number
  ) {
    console.log("Creating new article:", { title, authorId, topicId });

    if (!authorId || isNaN(Number(authorId))) {
      throw new Error("Invalid author ID: " + authorId);
    }
    if (!topicId || isNaN(Number(topicId))) {
      throw new Error("Invalid topic ID: " + topicId);
    }
    // 0 views initially
    const [newArticle] = await sql`
      INSERT INTO articles (title, author_id, text, image, topic_id, created_at, views)
      VALUES (${title}, ${authorId}, ${text}, ${image}, ${topicId}, DEFAULT, 0)
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
    console.log("Updating article with ID:", id);

    if (!id || isNaN(Number(id))) {
      console.error("Invalid article ID for update:", id);
      throw new Error("Invalid article ID: " + id);
    }

    const keys = Object.keys(data);
    const values = Object.values(data);

    if (keys.length === 0) {
      throw new Error("No fields to update");
    }

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

    values.push(Number(id));

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
    console.log("Deleting article with ID:", id);

    if (!id || isNaN(Number(id))) {
      console.error("Invalid article ID for delete:", id);
      throw new Error("Invalid article ID: " + id);
    }
    // First, update deleted_at before deleting
    await sql`
      UPDATE articles 
      SET deleted_at = NOW() 
      WHERE id = ${id};
    `;
    //Delete
    await sql`
      DELETE FROM articles 
      WHERE id = ${id};
    `;
  }
}
