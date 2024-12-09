import sql from "../configs/dbconfig";

export class ArticleRespository {
  static async findAll() {
    return await sql `SELECT * FROM articles`
  }

  static async findById(id: number) {
    const [article] = await sql `SELECT * FROM articles WHERE id = ${id}`;
    return article
  }

  static async create (title: string, author: string, text: string) {
    const [newArticle] = await sql `
    INSERT INTO articles (title, author, text, created_at)
    VALUE (${title}, ${author}, ${text}
    RETURNING *`
    return newArticle;
  }

  static async update (id: number, title: string, author: string, text: string) {
    await sql`
    UPDATE articles 
    SET title = ${title}, author = ${author}, text = ${text}
    WHERE id= ${id}`
}
  static async delete (id: number) {
    await sql`DELETE FROM articles WHERE id = ${id}`
  }

  static async findLatest(since:Date) {
    return await sql`
    SELECT * FROM articles 
    WHERE created_at > ${since}
    ORDER BY created_at DESC
    LIMIT 10`
  }
}