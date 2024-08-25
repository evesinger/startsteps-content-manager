"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dummyDataBase_1 = require("./dummyDataBase");
const router = express_1.default.Router();
// Show up to 10 latest articles created within the last hour
router.get('/latest', (req, res) => {
    const oneHourAgo = new Date(Date.now() - 3600 * 1000);
    let recentArticles = [];
    dummyDataBase_1.dummyDataBase.topics.forEach((topic) => {
        topic.articles.forEach((article) => {
            if (new Date(article.createdAt) >= oneHourAgo) {
                recentArticles.push(article);
            }
        });
    });
    // Sort by creation date and limit to 10 articles
    recentArticles = recentArticles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(recentArticles.slice(0, 10));
});
exports.default = router;
