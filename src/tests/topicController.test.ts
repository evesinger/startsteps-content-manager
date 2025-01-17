import request from 'supertest';
import app from '..';
import { dummyDataBase } from '../dummyDatabase';
import { Topic } from '../classes/Topics';
import { Article } from '../classes/Article';

describe('Topic Controller', () => {
  beforeEach(() => {
    // I reset dummyDataBase with test data
    dummyDataBase.topics = [
      new Topic("Test Topic 1"),
      new Topic("Test Topic 2")
    ];
    dummyDataBase.articles = [
      new Article("Test Article 1", "John Doe", "Sample text 1", new Date('2024-09-01T00:00:00Z')),
      new Article("Test Article 2", "Jane Doe", "Sample text 2", new Date('2024-09-01T00:00:00Z'))
    ];

    dummyDataBase.topics[0].addArticle(dummyDataBase.articles[0].id);
  });
// TEST 1
  test('POST / should create a new topic', async () => {
    const response = await request(app).post('/topics').send({ title: "New Topic" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ title: "New Topic" }));
  });
// TEST 2
  test('POST / with an existing topic title should return 400', async () => {
    const response = await request(app).post('/topics').send({ title: "Test Topic 1" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "A topic with this title already exists" });
  });

  // TEST 3
  test('DELETE /:topicId should delete a topic', async () => {
    const topicId = dummyDataBase.topics[0].id;
    const response = await request(app).delete(`/topics/${topicId}`);
    expect(response.status).toBe(204);

    const deletedTopic = dummyDataBase.topics.find(topic => topic.id === topicId);
    expect(deletedTopic).toBeUndefined();
  });

  // TEST 4
  test('GET / should return all topics', async () => {
    const response = await request(app).get('/topics');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  // TEST 5
  test('GET /:topicId should return a specific topic', async () => {
    const topicId = dummyDataBase.topics[0].id;
    const response = await request(app).get(`/topics/${topicId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ title: "Test Topic 1" }));
  });

  // TEST 6
  test('GET /:topicId with invalid topicId should return 400', async () => {
    const response = await request(app).get(`/topics/invalid`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Invalid topicId. It must be a number." });
  });

  // TEST 7
  test('GET /:topicId with non-existent topicId should return 404', async () => {
    const response = await request(app).get(`/topics/999`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Topic not found" });
  });

  // TEST 8
  test('GET /:topicId/articles should return all articles for a specific topic', async () => {
    const topicId = dummyDataBase.topics[0].id;
    const response = await request(app).get(`/topics/${topicId}/articles`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toEqual(expect.objectContaining({ title: "Test Article 1" }));
  });

  // TEST 9
  test('PUT /:topicId should update a topic by linking articles', async () => {
    const topicId = dummyDataBase.topics[1].id;
    const articleId = dummyDataBase.articles[1].id;

    const response = await request(app)
      .put(`/topics/${topicId}`)
      .send({ articleIds: [articleId] });
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Articles updated for the topic");
    expect(response.body.topic.articleIds).toContain(articleId);
  });

  // TEST !0

  test('POST /:topicId/articles should create and link a new article to a specific topic', async () => {
    const topicId = dummyDataBase.topics[0].id;
    const newArticle = { title: "New Linked Article", author: "Jane Doe", text: "This is linked text." };

    const response = await request(app).post(`/topics/${topicId}/articles`).send(newArticle);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining(newArticle));

    const createdArticle = dummyDataBase.articles.find(article => article.title === "New Linked Article");
    expect(createdArticle).toBeDefined();
    expect(dummyDataBase.topics[0].articleIds).toContain(createdArticle?.id);
  });
});

