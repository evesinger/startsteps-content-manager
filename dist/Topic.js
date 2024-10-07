"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
class Topic {
    constructor(title) {
        this.id = Topic.topicCounter++,
            this.title = title;
        this.articleIds = [];
    }
    addArticle(articleId) {
        this.articleIds.push(articleId);
    }
    removeArticle(articleId) {
        this.articleIds = this.articleIds.filter(id => id !== articleId);
    }
}
exports.Topic = Topic;
Topic.topicCounter = 1;
