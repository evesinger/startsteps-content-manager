"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const helpers_1 = __importDefault(require("../helpers"));
class Article {
    constructor(title, author, text, createdAt) {
        this.id = Article.articleCounter++;
        this.title = title;
        this.author = author;
        this.text = text;
        this.createdAt = createdAt;
    }
    // Static function including helper function 
    static create(title, author, text, createdAt = new Date()) {
        (0, helpers_1.default)(title, author, text, createdAt);
        return new Article(title, author, text, createdAt);
    }
}
exports.Article = Article;
Article.articleCounter = 1;
