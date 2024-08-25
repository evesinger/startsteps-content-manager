"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
class Article {
    constructor(title, author, text, topicId, createdAt = new Date().toISOString()) {
        this.id = Article.articleCount++; // Assigning a unique id to each article
        this.title = title;
        this.author = author;
        this.text = text;
        this.topicId = topicId;
        this.createdAt = createdAt;
    }
}
exports.Article = Article;
Article.articleCount = 1;
