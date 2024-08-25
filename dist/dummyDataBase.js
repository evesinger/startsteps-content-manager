"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyDataBase = void 0;
const Topic_1 = require("./Topic");
const Article_1 = require("./Article");
// Predefined topics
const topics = [
    new Topic_1.Topic("Technology"),
    new Topic_1.Topic("Health"),
    new Topic_1.Topic("Sports"),
];
// Predefined articles and associate them with topics by topicId
const articles = [
    new Article_1.Article("Test Title 1", "John Doe", "This is a test text number 1.", topics[0].id),
    new Article_1.Article("Test Title 2", "Jane Doe", "This is a test text number 2.", topics[0].id),
    new Article_1.Article("Test Title 3", "Axel Springer", "This is a test text number 3.", topics[1].id),
    new Article_1.Article("Test Title 4", "Frank Sinatra", "This is a test text number 4.", topics[1].id),
    new Article_1.Article("Test Title 5", "Dalai Lama", "This is a test text number 5.", topics[2].id),
    new Article_1.Article("Test Title 6", "Michael Jackson", "This is a test text number 6.", topics[2].id),
];
// Associate articles with their respective topics
articles.forEach(article => {
    const topic = topics.find(t => t.id === article.topicId);
    if (topic) {
        topic.addArticle(article); // Use addArticle method of Topic class
    }
});
exports.dummyDataBase = { topics, articles };
