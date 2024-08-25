"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
class Topic {
    constructor(title) {
        this.id = Topic.topicCounter++;
        this.title = title;
        this.articles = []; // Initialized as an empty array
    }
    // Method to add an article to the topic
    addArticle(article) {
        this.articles.push(article);
    }
    // Method to remove an article by article ID
    removeArticle(articleId) {
        this.articles = this.articles.filter(article => article.id !== articleId);
    }
    // Method to get an article by its ID
    getArticle(articleId) {
        return this.articles.find(article => article.id === articleId);
    }
}
exports.Topic = Topic;
Topic.topicCounter = 1;
