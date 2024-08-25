"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Article_1 = require("./Article");
const dummyDataBase_1 = require("./dummyDataBase");
const router = express_1.default.Router();
// Get all articles for a topic
router.get('/:topicId/articles', (req, res) => {
    const topicId = parseInt(req.params.topicId);
    const topic = dummyDataBase_1.dummyDataBase.topics.find(t => t.id === topicId);
    if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
    }
    res.json(topic.articles);
});
// Get a specific article in a topic
router.get('/:topicId/articles/:articleId', (req, res) => {
    const topicId = parseInt(req.params.topicId);
    const articleId = parseInt(req.params.articleId);
    const topic = dummyDataBase_1.dummyDataBase.topics.find(t => t.id === topicId);
    if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
    }
    const article = topic.getArticle(articleId);
    if (!article) {
        return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
});
// Create an article for a specific topic
router.post('/:topicId/articles', (req, res) => {
    const topicId = parseInt(req.params.topicId);
    const topic = dummyDataBase_1.dummyDataBase.topics.find(t => t.id === topicId);
    if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
    }
    const { title, author, text } = req.body;
    if (!title || !author || !text) {
        return res.status(400).json({ error: "Title, Author, and Text are required" });
    }
    const newArticle = new Article_1.Article(title, author, text, topicId);
    topic.addArticle(newArticle);
    res.status(201).json(newArticle);
});
// Delete an article from a topic
router.delete('/:topicId/articles/:articleId', (req, res) => {
    const topicId = parseInt(req.params.topicId);
    const articleId = parseInt(req.params.articleId);
    const topic = dummyDataBase_1.dummyDataBase.topics.find(t => t.id === topicId);
    if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
    }
    const articleIndex = topic.articles.findIndex(article => article.id === articleId);
    if (articleIndex === -1) {
        return res.status(404).json({ error: "Article not found" });
    }
    topic.articles.splice(articleIndex, 1); // Remove the article
    res.status(204).send();
});
exports.default = router;
