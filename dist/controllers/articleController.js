"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Article_1 = require("../classes/Article");
const dummyDataBase_1 = require("../database/dummyDataBase");
const router = express_1.default.Router();
// ENDPOINT 1. Get all articles, optionally filtered by topicId
router.get('/', (req, res) => {
    const allArticles = dummyDataBase_1.dummyDataBase.articles;
    res.json(allArticles);
});
// ENDPOINT 2. Get a specific article by its articleID
router.get('/:articleId(\\d+)', (req, res) => {
    const articleId = parseInt(req.params.articleId);
    if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid articleId. It must be a number." });
    }
    const article = dummyDataBase_1.dummyDataBase.articles.find(article => article.id === articleId);
    if (!article) {
        return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
});
// ENDPOINT 3. Update an article by its ID
router.put('/:articleId', (req, res) => {
    const articleId = parseInt(req.params.articleId);
    const { title, author, text } = req.body;
    if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid articleId. It must be a number." });
    }
    const article = dummyDataBase_1.dummyDataBase.articles.find(article => article.id === articleId);
    if (!article) {
        return res.status(404).json({ error: "Article not found" });
    }
    if (title)
        article.title = title;
    if (author)
        article.author = author;
    if (text)
        article.text = text;
    res.json(article);
});
// ENDPOINT 4 Delete an article by its ID
router.delete('/:articleId', (req, res) => {
    const articleId = parseInt(req.params.articleId);
    if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid articleId. It must be a number." });
    }
    const articleIndex = dummyDataBase_1.dummyDataBase.articles.findIndex(article => article.id === articleId);
    if (articleIndex === -1) {
        return res.status(404).json({ error: "Article not found" });
    }
    dummyDataBase_1.dummyDataBase.articles.splice(articleIndex, 1);
    for (const topic of dummyDataBase_1.dummyDataBase.topics) {
        topic.removeArticle(articleId);
    }
    res.status(204).send();
});
// ENDPOINT 5: Getting latest articles
router.get('/latest', (req, res) => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // current time minus 1 hour
    let articles = dummyDataBase_1.dummyDataBase.articles.filter(article => new Date(article.createdAt) > oneHourAgo);
    res.json(articles); // **return  10 latest articles** .slice(0, 10)
});
exports.default = router;
// ENDPOINT 7. Create a new article withouth linking to a topic
router.post('/', (req, res) => {
    const { title, author, text } = req.body;
    if (!title || !author || !text) {
        return res.status(400).json({ error: "Title, Author, and Text are required" });
    }
    const newArticle = new Article_1.Article(title, author, text, new Date());
    dummyDataBase_1.dummyDataBase.articles.push(newArticle);
    res.status(200).json(newArticle);
});
