import request from 'supertest';
import app from '..';
import { dummyDataBase } from '../database/dummyDataBase';
import { Article } from '../classes/Article';

describe('Article Controller', () => {
  beforeEach(() => {
    // I reset dummyDataBase with test data
    dummyDataBase.articles = [
      new Article("Test Article 1", "John Doe", "This is the first test article", new Date('2024-09-01T00:00:00Z')),
      new Article("Test Article 2", "Jane Doe", "This is the second test article", new Date('2024-09-01T00:00:00Z'))
    ];
  });

  // TEST 1
  test('GET /articles should return all articles', async () => {
    const response = await request(app).get('/articles');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  // TEST 2

  test('GET /articles/:articleId should return a specific article', async () => {
    const articleId = dummyDataBase.articles[0].id;
    const response = await request(app).get(`/articles/${articleId}`);
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
    const articleId = dummyDataBase.articles[0].id;
    const updatedData = { title: "Updated Title", author: "Updated Author", text: "Updated text" };
    
    const response = await request(app).put(`/articles/${articleId}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedData);

    const updatedArticle = dummyDataBase.articles.find(article => article.id === articleId);
    expect(updatedArticle).toMatchObject(updatedData);
  });

// TEST 5 
  test('DELETE /articles/:articleId should delete an article', async () => {
    const articleId = dummyDataBase.articles[0].id;
    const response = await request(app).delete(`/articles/${articleId}`);
    expect(response.status).toBe(204);

    const deletedArticle = dummyDataBase.articles.find(article => article.id === articleId);
    expect(deletedArticle).toBeUndefined();
  });

  // TEST 6

  test('GET /articles/latest should return articles created within the last hour', async () => {
    const recentArticle = new Article("Recent Article", "Recent Author", "This is recent", new Date());
    dummyDataBase.articles.push(recentArticle);

    const response = await request(app).get('/articles/latest');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ title: "Recent Article" })]));
  });

  // TEST 7
  test('POST /articles should create a new article', async () => {
    const newArticleData = { title: "New Article", author: "New Author", text: "This is a new article" };
    const response = await request(app).post('/articles').send(newArticleData);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(newArticleData));

    const createdArticle = dummyDataBase.articles.find(article => article.title === "New Article");
    expect(createdArticle).toBeDefined();
    expect(createdArticle).toMatchObject(newArticleData);
  });

  // TEST 8
  test('POST /articles with missing fields should return 400', async () => {
    const incompleteData = { title: "Incomplete Article", author: "Author" };
    const response = await request(app).post('/articles').send(incompleteData);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Title, Author, and Text are required" });
  });
});
