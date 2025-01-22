"use strict";
//import { Author } from "./Author";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
class Article {
    constructor(id, title, text, views, createdAt) {
        this.id = id;
        this.title = title;
        //this.author = author;
        this.text = text;
        this.views = views;
        this.createdAt = createdAt;
    }
}
exports.Article = Article;
// Keeping Article Class for seperation of concerns and future scale the application with more complex data handling requirements.
