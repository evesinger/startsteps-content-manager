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
// ENDPOINT 1. Get all articles, optionally filtered by topicId
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield ArticleRepository_1.ArticleRepository.findAll();
        res.status(200).json(articles);
    }
    catch (err) {
        console.error("Error in GET /articles:", err); // Log the error for debugging
        res.status(500).json({ error: "Failed to retrieve articles" });
    }
}));
// ENDPOINT 2. Get a specific article by its articleID
router.get('/:articleId(\\d+)', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articleId = parseInt(req.params.articleId);
    if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid articleId. It must be a number." });
    }
    try {
        const article = yield ArticleRepository_1.ArticleRepository.findById(articleId);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        res.json(article);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to retrieve the article" });
    }
}));
// ENDPOINT 3. Update an article by its ID
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
        const article = yield ArticleRepository_1.ArticleRepository.findById(articleId);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        yield ArticleRepository_1.ArticleRepository.update(articleId, title, author, text);
        const updatedArticle = yield ArticleRepository_1.ArticleRepository.findById(articleId);
        res.json(updatedArticle);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update the article" });
    }
}));
// ENDPOINT 4 Delete an article by its ID
router.delete('/:articleId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const articleId = parseInt(req.params.articleId);
    if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid articleId. It must be a number." });
    }
    try {
        const article = yield ArticleRepository_1.ArticleRepository.findById(articleId);
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        yield ArticleRepository_1.ArticleRepository.delete(articleId);
        res.status(204).send();
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete the article" });
    }
}));
// ENDPOINT 5: Getting latest articles
// router.get('/latest', async (req: Request, res: Response) => {
//   try {
//     const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // current time minus 1 hour
//     const articles = await ArticleRepository.findLatest(oneHourAgo);
//     res.json(articles.slice(0, 10)); // return up to 10 latest articles
//   } catch (err) {
//     res.status(500).json({ error: "Failed to retrieve latest articles" });
//   }
// });
// ENDPOINT 7. Create a new article withouth linking to a topic
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, text } = req.body;
    if (!title || !author || !text) {
        return res.status(400).json({ error: "Title, Author, and Text are required" });
    }
    try {
        const newArticle = yield ArticleRepository_1.ArticleRepository.create(title, author, text);
        res.status(201).json(newArticle);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create article" });
    }
}));
exports.default = router;
