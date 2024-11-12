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
const dummyDataBase_1 = require("../database/dummyDataBase");
const Article_1 = require("../classes/Article");
describe('Article Controller', () => {
    beforeEach(() => {
        // I reset dummyDataBase with test data
        dummyDataBase_1.dummyDataBase.articles = [
            new Article_1.Article("Test Article 1", "John Doe", "This is the first test article", new Date('2024-09-01T00:00:00Z')),
            new Article_1.Article("Test Article 2", "Jane Doe", "This is the second test article", new Date('2024-09-01T00:00:00Z'))
        ];
    });
    // TEST 1
    test('GET /articles should return all articles', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.default).get('/articles');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    }));
    // TEST 2
    test('GET /articles/:articleId should return a specific article', () => __awaiter(void 0, void 0, void 0, function* () {
        const articleId = dummyDataBase_1.dummyDataBase.articles[0].id;
        const response = yield (0, supertest_1.default)(__1.default).get(`/articles/${articleId}`);
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
        const articleId = dummyDataBase_1.dummyDataBase.articles[0].id;
        const updatedData = { title: "Updated Title", author: "Updated Author", text: "Updated text" };
        const response = yield (0, supertest_1.default)(__1.default).put(`/articles/${articleId}`).send(updatedData);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(updatedData);
        const updatedArticle = dummyDataBase_1.dummyDataBase.articles.find(article => article.id === articleId);
        expect(updatedArticle).toMatchObject(updatedData);
    }));
    // TEST 5 
    test('DELETE /articles/:articleId should delete an article', () => __awaiter(void 0, void 0, void 0, function* () {
        const articleId = dummyDataBase_1.dummyDataBase.articles[0].id;
        const response = yield (0, supertest_1.default)(__1.default).delete(`/articles/${articleId}`);
        expect(response.status).toBe(204);
        const deletedArticle = dummyDataBase_1.dummyDataBase.articles.find(article => article.id === articleId);
        expect(deletedArticle).toBeUndefined();
    }));
    // TEST 6
    test('GET /articles/latest should return articles created within the last hour', () => __awaiter(void 0, void 0, void 0, function* () {
        const recentArticle = new Article_1.Article("Recent Article", "Recent Author", "This is recent", new Date());
        dummyDataBase_1.dummyDataBase.articles.push(recentArticle);
        const response = yield (0, supertest_1.default)(__1.default).get('/articles/latest');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining({ title: "Recent Article" })]));
    }));
    // TEST 7
    test('POST /articles should create a new article', () => __awaiter(void 0, void 0, void 0, function* () {
        const newArticleData = { title: "New Article", author: "New Author", text: "This is a new article" };
        const response = yield (0, supertest_1.default)(__1.default).post('/articles').send(newArticleData);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(newArticleData));
        const createdArticle = dummyDataBase_1.dummyDataBase.articles.find(article => article.title === "New Article");
        expect(createdArticle).toBeDefined();
        expect(createdArticle).toMatchObject(newArticleData);
    }));
    // TEST 8
    test('POST /articles with missing fields should return 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const incompleteData = { title: "Incomplete Article", author: "Author" };
        const response = yield (0, supertest_1.default)(__1.default).post('/articles').send(incompleteData);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Title, Author, and Text are required" });
    }));
});
