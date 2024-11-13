import request from 'supertest';
import app from '..';
import { initDatabase } from '../database/database';
import { Database } from 'sqlite';

let db: Database;

beforeAll(async () => {
  db = await initDatabase(true); //  in-memory database for testing
});


afterAll(async () => {
  await db.close();
});

beforeEach(async () => {
  // Clear tables and seed sample data before each test
  await db.exec('DELETE FROM articles');
  await db.exec('DELETE FROM topics');
  await db.exec('DELETE FROM topic_articles');

  // Seed articles table with sample data
  await db.run(`
    INSERT INTO articles (title, author, text, created_at) VALUES
    ('Test Article 1', 'John Doe', 'This is the first test article', '2024-09-01T00:00:00Z'),
    ('Test Article 2', 'Jane Doe', 'This is the second test article', '2024-09-01T00:00:00Z')
  `);
});


describe('Article Controller', () => {
 
  // TEST 1
  test('GET /articles should return all articles', async () => {
    const response = await request(app).get('/articles');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  // TEST 2

  test('GET /articles/:articleId should return a specific article', async () => {
    const response = await request(app).get(`/articles/1`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ title: "Test Article 1" }));
  });

// TEST3
  test('GET /articles/:articleId with non-existent ID should return 404', async () => {
    const response = await request(app).get('/articles/999');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Article not found" });
  });

// TEST4

  test('PUT /articles/:articleId should update an article', async () => {
    const updatedData = { title: "Updated Title", author: "Updated Author", text: "Updated text" };
    
    const response = await request(app).put(`/articles/1`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedData);

    // Verify 
    const updatedArticle = await db.get('SELECT * FROM articles WHERE id = 1');
    expect(updatedArticle.title).toBe("Updated Title");
    expect(updatedArticle.author).toBe("Updated Author");
    expect(updatedArticle.text).toBe("Updated text");
  });


// TEST 5 
  test('DELETE /articles/:articleId should delete an article', async () => {
    const response = await request(app).delete(`/articles/1`);
    expect(response.status).toBe(204);

  // verify 
  const deletedArticle = await db.get('SELECT * FROM articles WHERE id = 1');
  expect(deletedArticle).toBeUndefined();
});


  // TEST 6

  test('GET /articles/latest should return articles created within the last hour', async () => {
    await db.run(`
    INSERT INTO articles (title, author, text, created_at) VALUES
    ('Recent Article', 'Recent Author', 'This is recent', datetime('now'))
  `);

    const response = await request(app).get('/articles/latest');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ title: "Recent Article" })]));
  });

  // TEST 7
  test('POST /articles should create a new article', async () => {
    const newArticleData = { title: "New Article", author: "New Author", text: "This is a new article" };
    const response = await request(app).post('/articles').send(newArticleData);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(newArticleData));

    // Verify
    const createdArticle = await db.get('SELECT * FROM articles WHERE title = "New Article"');
    expect(createdArticle).toBeDefined();
    expect(createdArticle.title).toBe("New Article");
  });

  // TEST 8
  test('POST /articles with missing fields should return 400', async () => {
    const incompleteData = { title: "Incomplete Article", author: "Author" };
    const response = await request(app).post('/articles').send(incompleteData);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Title, Author, and Text are required" });
  });
});
