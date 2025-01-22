"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
class Topic {
    constructor(id, title) {
        this.id = id,
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
// Keeping Topics Class for seperation of concerns and future scale the application with more complex data handling requirements.
