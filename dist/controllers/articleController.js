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
const ArticleRepository_1 = require("../repositories/ArticleRepository");
const router = express_1.default.Router();
// Get all articles
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield ArticleRepository_1.ArticleRespository.findAll();
        res.status(200).json(articles);
    }
    catch (err) {
        console.error("Error in GET /articles:", err);
        res.status(500).json({ error: "Failed to retrieve articles" });
    }
}));
// Get a specific article by its articleID
router.get('/:articleId(\\d+)', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articleId = parseInt(req.params.articleId);
    if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid articleId. It must be a number." });
    }
    try {
        const article = yield ArticleRepository_1.ArticleRespository.findById(articleId);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        res.json(article);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve the article" });
    }
}));
// Update an article by its ID
router.put('/:articleId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articleId = parseInt(req.params.articleId);
    const { title, author, text } = req.body;
    if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid articleId. It must be a number." });
    }
    if (!title || !author || !text) {
        return res.status(400).json({ error: "Title, Author, and Text are required to update an article." });
    }
    try {
        const article = yield ArticleRepository_1.ArticleRespository.findById(articleId);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        yield ArticleRepository_1.ArticleRespository.update(articleId, title, author, text);
        const updatedArticle = yield ArticleRepository_1.ArticleRespository.findById(articleId);
        res.json(updatedArticle);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update the article" });
    }
}));
// Delete an article by its ID
router.delete('/:articleId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articleId = parseInt(req.params.articleId);
    if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid articleId. It must be a number." });
    }
    try {
        const article = yield ArticleRepository_1.ArticleRespository.findById(articleId);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        yield ArticleRepository_1.ArticleRespository.delete(articleId);
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete the article" });
    }
}));
//Getting latest articles
router.get('/latest', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour in milliseconds
        const articles = yield ArticleRepository_1.ArticleRespository.findLatest(oneHourAgo);
        res.status(200).json(articles.slice(0, 10));
    }
    catch (err) {
        console.error("Error in GET /latest:", err);
        res.status(500).json({ error: "Failed to retrieve the latest articles" });
    }
}));
// Create a new article withouth linking to a topic
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, text } = req.body;
    if (!title || !author || !text) {
        return res.status(400).json({ error: "Title, Author, and Text are required" });
    }
    try {
        const newArticle = yield ArticleRepository_1.ArticleRespository.create(title, author, text);
        res.status(201).json(newArticle);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create article" });
    }
}));
exports.default = router;
