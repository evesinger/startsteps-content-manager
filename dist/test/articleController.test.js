"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const __1 = __importDefault(require(".."));
const createTable_1 = require("../database/createTable");
let db;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    db = yield (0, createTable_1.initDatabase)(true); //  in-memory database for testing
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.close();
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    // Clear tables and seed sample data before each test
    yield db.exec('DELETE FROM articles');
    yield db.exec('DELETE FROM topics');
    yield db.exec('DELETE FROM topic_articles');
    // Seed articles table with sample data
    yield db.run(`
    INSERT INTO articles (title, author, text, created_at) VALUES
    ('Test Article 1', 'John Doe', 'This is the first test article', '2024-09-01T00:00:00Z'),
    ('Test Article 2', 'Jane Doe', 'This is the second test article', '2024-09-01T00:00:00Z')
  `);
}));
describe('Article Controller', () => {
    // TEST 1
    test('GET /articles should return all articles', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.default).get('/articles');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    }));
    // TEST 2
    test('GET /articles/:articleId should return a specific article', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.default).get(`/articles/1`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ title: "Test Article 1" }));
    }));
    // TEST3
    test('GET /articles/:articleId with non-existent ID should return 404', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.default).get('/articles/999');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Article not found" });
    }));
    // TEST4
    test('PUT /articles/:articleId should update an article', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedData = { title: "Updated Title", author: "Updated Author", text: "Updated text" };
        const response = yield (0, supertest_1.default)(__1.default).put(`/articles/1`).send(updatedData);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(updatedData);
        // Verify 
        const updatedArticle = yield db.get('SELECT * FROM articles WHERE id = 1');
        expect(updatedArticle.title).toBe("Updated Title");
        expect(updatedArticle.author).toBe("Updated Author");
        expect(updatedArticle.text).toBe("Updated text");
    }));
    // TEST 5 
    test('DELETE /articles/:articleId should delete an article', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.default).delete(`/articles/1`);
        expect(response.status).toBe(204);
        // verify 
        const deletedArticle = yield db.get('SELECT * FROM articles WHERE id = 1');
        expect(deletedArticle).toBeUndefined();
    }));
    // TEST 6
    test('GET /articles/latest should return articles created within the last hour', () => __awaiter(void 0, void 0, void 0, function* () {
        yield db.run(`
    INSERT INTO articles (title, author, text, created_at) VALUES
    ('Recent Article', 'Recent Author', 'This is recent', datetime('now'))
  `);
        const response = yield (0, supertest_1.default)(__1.default).get('/articles/latest');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ title: "Recent Article" })]));
    }));
    // TEST 7
    test('POST /articles should create a new article', () => __awaiter(void 0, void 0, void 0, function* () {
        const newArticleData = { title: "New Article", author: "New Author", text: "This is a new article" };
        const response = yield (0, supertest_1.default)(__1.default).post('/articles').send(newArticleData);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(expect.objectContaining(newArticleData));
        // Verify
        const createdArticle = yield db.get('SELECT * FROM articles WHERE title = "New Article"');
        expect(createdArticle).toBeDefined();
        expect(createdArticle.title).toBe("New Article");
    }));
    // TEST 8
    test('POST /articles with missing fields should return 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const incompleteData = { title: "Incomplete Article", author: "Author" };
        const response = yield (0, supertest_1.default)(__1.default).post('/articles').send(incompleteData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Title, Author, and Text are required" });
    }));
});
