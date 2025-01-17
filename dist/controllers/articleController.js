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
router.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield ArticleRepository_1.ArticleRepository.findAll();
        res.status(200).json(articles);
    }
    catch (error) {
        console.error("Error fetching articles:", error);
        res.status(500).json({ error: "Failed to fetch articles" });
    }
}));
// Get an article by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const article = yield ArticleRepository_1.ArticleRepository.findById(Number(id));
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        res.status(200).json(article);
    }
    catch (error) {
        console.error("Error fetching article:", error);
        res.status(500).json({ error: "Failed to fetch article" });
    }
}));
// Create an article
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, text, image, topicId } = req.body;
    if (!title || !author || !text || !image || !topicId) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const newArticle = yield ArticleRepository_1.ArticleRepository.create(title, author, text, image, topicId);
        res.status(201).json(newArticle);
    }
    catch (error) {
        console.error("Error creating article:", error);
        res.status(500).json({ error: "Failed to create article" });
    }
}));
// Update an article
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, author, text, image } = req.body;
    // Ensure at least one field is provided for an update
    if (!title && !author && !text && !image) {
        return res.status(400).json({ error: "At least one field is required to update" });
    }
    try {
        // Prepare an update object dynamically
        const updateData = {};
        if (title)
            updateData.title = title;
        if (author)
            updateData.author = author;
        if (text)
            updateData.text = text;
        if (image)
            updateData.image = image;
        const updatedArticle = yield ArticleRepository_1.ArticleRepository.update(Number(id), updateData);
        if (!updatedArticle) {
            return res.status(404).json({ error: "Article not found" });
        }
        res.status(200).json({ message: "Article updated successfully", updatedArticle });
    }
    catch (error) {
        console.error("Error updating article:", error);
        res.status(500).json({ error: "Failed to update article" });
    }
}));
//Delete Article
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const article = yield ArticleRepository_1.ArticleRepository.findById(Number(id)); // Check if the article exists
        if (!article) {
            return res.status(404).json({ error: "Article not found" });
        }
        yield ArticleRepository_1.ArticleRepository.delete(Number(id));
        res.status(200).json({ message: "Article deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting article:", error);
        res.status(500).json({ error: "Failed to delete article" });
    }
}));
exports.default = router;
