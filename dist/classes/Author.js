"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Author = void 0;
class Author {
    constructor(name) {
        this.id = Author.authorCounter++,
            this.name = name;
        this.articleIds = [];
    }
}
exports.Author = Author;
Author.authorCounter = 1;
