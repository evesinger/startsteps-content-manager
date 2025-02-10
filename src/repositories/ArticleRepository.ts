import sql from "../configs/dbconfig";

export class ArticleRepository {
  // Find All Articles
  static async findAll() {
    return await sql`
      SELECT articles.*, 
             authors.first_name, 
             authors.last_name
      FROM articles
      LEFT JOIN authors ON articles.author_id = authors.id;
    `;
  }

  // Find Article by ID
  static async findById(articleId: number) {
    console.log("Fetching article with ID:", articleId);

    if (!articleId || isNaN(Number(articleId))) {
      console.error("Invalid article ID:", articleId);
      throw new Error("Invalid article ID: " + articleId);
    }

    const [article] = await sql`
      SELECT articles.*, 
             authors.first_name, 
             authors.last_name
      FROM articles
      LEFT JOIN authors ON articles.author_id = authors.id
      WHERE articles.id = ${Number(articleId)};
    `;

    return article;
  }

  // Find Articles by Author ID with Validation
  static async findByAuthorId(authorId: number) {
    console.log("Fetching articles for Author ID:", authorId);

    if (!authorId || isNaN(Number(authorId))) {
      console.error("Invalid author ID:", authorId);
      throw new Error("Invalid author ID: " + authorId);
    }

    return await sql`
      SELECT * FROM articles WHERE author_id = ${Number(authorId)};
    `;
  }

  // Create a New Article with Validation
  static async create(
    title: string,
    authorId: number,
    text: string,
    image: string,
    topicId: number,
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
      VALUES (${title}, ${authorId}, ${text}, ${image}, ${topicId}, NOW(), 0)
      RETURNING *;
    `;

    // Update views after 5 seconds for demo
    setTimeout(async () => {
      try {
        const randomViews = Math.floor(Math.random() * (1000 - 50 + 1)) + 50;

        await sql`
          UPDATE articles
          SET views = ${randomViews}
          WHERE id = ${newArticle.id};
        `;
        console.log(
          `Views updated to ${randomViews} for article ID: ${newArticle.id}`,
        );
      } catch (error) {
        console.error(
          `Error updating views for article ID: ${newArticle.id}`,
          error,
        );
      }
    }, 5000);

    // Log the action in `activity_log`
    await sql`
  INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
  VALUES (${newArticle.id}, 'Article', ${authorId}, 'CREATE', NOW());
`;

    return newArticle;
  }

  // Update an Article with Validation
  static async update(
    id: number,
    data: Record<string, string | number>,
    authorId: number,
  ) {
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

    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    values.push(Number(id)); // Convert id to number (to avoid type error)

    const query = `
    UPDATE articles
    SET ${setClause}
    WHERE id = $${keys.length + 1}
    RETURNING *;
  `;

    const [updatedArticle] = await sql.unsafe(query, values);

    // Log the update in `activity_log`
    await sql`
    INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
    VALUES (${updatedArticle.id}, 'Article', ${authorId}, 'UPDATE', NOW());
  `;

    return updatedArticle;
  }

  // Delete an Article with Validation
  static async delete(id: number, authorId: number) {
    console.log("Deleting article with ID:", id);

    if (!id || isNaN(Number(id))) {
      console.error("Invalid article ID for delete:", id);
      throw new Error("Invalid article ID: " + id);
    }

    // first, update deleted_at (soft delete)
    await sql`
    UPDATE articles 
    SET deleted_at = NOW() 
    WHERE id = ${id};
  `;

    // Log the deletion in `activity_log`
    await sql`
    INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
    VALUES (${id}, 'Article', ${authorId}, 'DELETE', NOW());
  `;

    // then, permanently delete
    await sql`
    DELETE FROM articles 
    WHERE id = ${id};
  `;
  }
}
