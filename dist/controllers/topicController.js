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
const express_1 = __importDefault(require("express"));
const TopicRepository_1 = require("../repositories/TopicRepository");
const ArticleRepository_1 = require("../repositories/ArticleRepository");
const router = express_1.default.Router();
// ENDPOINT 1. Create a new topic
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }
    try {
        const newTopic = yield TopicRepository_1.TopicRepository.create(title);
        res.status(200).json(newTopic);
    }
    catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({ error: 'Failed to create topic' });
    }
}));
// ENDPOINT 2. Delete a topic
router.delete('/:topicId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topicId = parseInt(req.params.topicId);
    if (isNaN(topicId)) {
        return res.status(400).json({ error: "Invalid topicId. It must be a number." });
    }
    try {
        const topic = yield TopicRepository_1.TopicRepository.findById(topicId);
        if (!topic) {
            return res.status(404).json({ error: "Topic not found" });
        }
        yield TopicRepository_1.TopicRepository.delete(topicId);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({ error: 'Failed to delete topic' });
    }
}));
// ENDPOINT 3. List all topics
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topics = yield TopicRepository_1.TopicRepository.findAll();
        res.status(200).json(topics);
    }
    catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ error: 'Failed to fetch topics' });
    }
}));
// ENDPOINT 4. Show a specific topic
router.get('/:topicId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topicId = parseInt(req.params.topicId);
    if (isNaN(topicId)) {
        return res.status(400).json({ error: "Invalid topicId. It must be a number." });
    }
    try {
        const topic = yield TopicRepository_1.TopicRepository.findById(topicId);
        if (!topic) {
            return res.status(404).json({ error: "Topic not found" });
        }
        res.status(200).json(topic);
    }
    catch (error) {
        console.error('Error fetching topic:', error);
        res.status(500).json({ error: 'Failed to fetch topic' });
    }
}));
// ENDPOINT 5. Get all articles for a specific topic
router.get('/:topicId/articles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topicId = parseInt(req.params.topicId);
    if (isNaN(topicId)) {
        return res.status(400).json({ error: "Invalid topicId. It must be a number." });
    }
    try {
        const topic = yield TopicRepository_1.TopicRepository.findById(topicId);
        if (!topic) {
            return res.status(404).json({ error: "Topic not found" });
        }
        const articles = yield TopicRepository_1.TopicRepository.getArticlesForTopic(topicId);
        res.status(200).json(articles);
    }
    catch (error) {
        console.error('Error fetching articles for topic:', error);
        res.status(500).json({ error: 'Failed to fetch articles for topic' });
    }
}));
// ENDPOINT 6. Update a topic (link existing articles)
router.put('/:topicId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topicId = parseInt(req.params.topicId);
    const { articleIds } = req.body;
    if (isNaN(topicId)) {
        return res.status(400).json({ error: "Invalid topicId. It must be a number." });
    }
    if (!articleIds || !Array.isArray(articleIds)) {
        return res.status(400).json({ error: "Article IDs must be provided as an array." });
    }
    try {
        const topic = yield TopicRepository_1.TopicRepository.findById(topicId);
        if (!topic) {
            return res.status(404).json({ error: "Topic not found" });
        }
        const invalidArticles = [];
        for (const articleId of articleIds) {
            const article = yield ArticleRepository_1.ArticleRespository.findById(articleId);
            if (!article) {
                invalidArticles.push(articleId);
            }
        }
        if (invalidArticles.length > 0) {
            return res.status(404).json({ error: `Articles with IDs ${invalidArticles.join(', ')} not found.` });
        }
        yield TopicRepository_1.TopicRepository.addArticlesToTopic(topicId, articleIds);
        res.status(200).json({ message: "Articles linked to topic successfully." });
    }
    catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).json({ error: 'Failed to update topic' });
    }
}));
// ENDPOINT 7. Create a new article linked to a specific topic
router.post('/:topicId/articles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topicId = parseInt(req.params.topicId);
    const { title, author, text } = req.body;
    if (isNaN(topicId)) {
        return res.status(400).json({ error: "Invalid topicId. It must be a number." });
    }
    if (!title || !author || !text) {
        return res.status(400).json({ error: "Title, Author, and Text are required." });
    }
    try {
        const topic = yield TopicRepository_1.TopicRepository.findById(topicId);
        if (!topic) {
            return res.status(404).json({ error: "Topic not found." });
        }
        const newArticle = yield ArticleRepository_1.ArticleRespository.create(title, author, text);
        yield TopicRepository_1.TopicRepository.addArticlesToTopic(topicId, [newArticle.id]);
        res.status(200).json(newArticle);
    }
    catch (error) {
        console.error('Error creating article for topic:', error);
        res.status(500).json({ error: 'Failed to create article for topic.' });
    }
}));
exports.default = router;
