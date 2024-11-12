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
const Topic_1 = require("../classes/Topic");
const Article_1 = require("../classes/Article");
describe('Topic Controller', () => {
    beforeEach(() => {
        // I reset dummyDataBase with test data
        dummyDataBase_1.dummyDataBase.topics = [
            new Topic_1.Topic("Test Topic 1"),
            new Topic_1.Topic("Test Topic 2")
        ];
        dummyDataBase_1.dummyDataBase.articles = [
            new Article_1.Article("Test Article 1", "John Doe", "Sample text 1", new Date('2024-09-01T00:00:00Z')),
            new Article_1.Article("Test Article 2", "Jane Doe", "Sample text 2", new Date('2024-09-01T00:00:00Z'))
        ];
        dummyDataBase_1.dummyDataBase.topics[0].addArticle(dummyDataBase_1.dummyDataBase.articles[0].id);
    });
    // TEST 1
    test('POST / should create a new topic', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.default).post('/topics').send({ title: "New Topic" });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ title: "New Topic" }));
    }));
    // TEST 2
    test('POST / with an existing topic title should return 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.default).post('/topics').send({ title: "Test Topic 1" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "A topic with this title already exists" });
    }));
    // TEST 3
    test('DELETE /:topicId should delete a topic', () => __awaiter(void 0, void 0, void 0, function* () {
        const topicId = dummyDataBase_1.dummyDataBase.topics[0].id;
        const response = yield (0, supertest_1.default)(__1.default).delete(`/topics/${topicId}`);
        expect(response.status).toBe(204);
        const deletedTopic = dummyDataBase_1.dummyDataBase.topics.find(topic => topic.id === topicId);
        expect(deletedTopic).toBeUndefined();
    }));
    // TEST 4
    test('GET / should return all topics', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.default).get('/topics');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    }));
    // TEST 5
    test('GET /:topicId should return a specific topic', () => __awaiter(void 0, void 0, void 0, function* () {
        const topicId = dummyDataBase_1.dummyDataBase.topics[0].id;
        const response = yield (0, supertest_1.default)(__1.default).get(`/topics/${topicId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ title: "Test Topic 1" }));
    }));
    // TEST 6
    test('GET /:topicId with invalid topicId should return 400', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.default).get(`/topics/invalid`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: "Invalid topicId. It must be a number." });
    }));
    // TEST 7
    test('GET /:topicId with non-existent topicId should return 404', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(__1.default).get(`/topics/999`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: "Topic not found" });
    }));
    // TEST 8
    test('GET /:topicId/articles should return all articles for a specific topic', () => __awaiter(void 0, void 0, void 0, function* () {
        const topicId = dummyDataBase_1.dummyDataBase.topics[0].id;
        const response = yield (0, supertest_1.default)(__1.default).get(`/topics/${topicId}/articles`);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toEqual(expect.objectContaining({ title: "Test Article 1" }));
    }));
    // TEST 9
    test('PUT /:topicId should update a topic by linking articles', () => __awaiter(void 0, void 0, void 0, function* () {
        const topicId = dummyDataBase_1.dummyDataBase.topics[1].id;
        const articleId = dummyDataBase_1.dummyDataBase.articles[1].id;
        const response = yield (0, supertest_1.default)(__1.default)
            .put(`/topics/${topicId}`)
            .send({ articleIds: [articleId] });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Articles updated for the topic");
        expect(response.body.topic.articleIds).toContain(articleId);
    }));
    // TEST !0
    test('POST /:topicId/articles should create and link a new article to a specific topic', () => __awaiter(void 0, void 0, void 0, function* () {
        const topicId = dummyDataBase_1.dummyDataBase.topics[0].id;
        const newArticle = { title: "New Linked Article", author: "Jane Doe", text: "This is linked text." };
        const response = yield (0, supertest_1.default)(__1.default).post(`/topics/${topicId}/articles`).send(newArticle);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(newArticle));
        const createdArticle = dummyDataBase_1.dummyDataBase.articles.find(article => article.title === "New Linked Article");
        expect(createdArticle).toBeDefined();
        expect(dummyDataBase_1.dummyDataBase.topics[0].articleIds).toContain(createdArticle === null || createdArticle === void 0 ? void 0 : createdArticle.id);
    }));
});
