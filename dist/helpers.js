"use strict";
// To be repalced with Joi librry 
Object.defineProperty(exports, "__esModule", { value: true });
function validateArticleData(title, text, createdAt) {
    const errors = [];
    if (!title)
        errors.push("Title is required");
    //f (!author) errors.push("Author is required");
    if (!text)
        errors.push("Text is required");
    if (errors.length > 0) {
        throw new Error(errors.join(", "));
    }
}
exports.default = validateArticleData;
