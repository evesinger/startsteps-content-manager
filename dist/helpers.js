"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//* ADDED: helper function for article data validation
function validateArticleData(title, author, text, createdAt) {
    const errors = [];
    if (!title)
        errors.push("Title is required");
    if (!author)
        errors.push("Author is required");
    if (!text)
        errors.push("Text is required");
    if (errors.length > 0) {
        throw new Error(errors.join(", "));
    }
}
exports.default = validateArticleData;
