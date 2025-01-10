"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;
const helpers_1 = __importDefault(require("../helpers"));
//import { Author } from "./Author";
class Article {
    constructor(title, text, createdAt) {
        this.id = Article.articleCounter++;
        this.title = title;
        //this.author = author;
        this.text = text;
        this.createdAt = createdAt;
    }
    // Static function including helper function 
    static create(title, text, createdAt = new Date()) {
        (0, helpers_1.default)(title, text, createdAt);
        return new Article(title, text, createdAt);
    }
}
exports.Article = Article;
Article.articleCounter = 1;
