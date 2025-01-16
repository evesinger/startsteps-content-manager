"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyDataBase = exports.hardCodedDate = void 0;
const Topic_1 = require("../classes/Topic");
const Article_1 = require("../classes/Article");
const topics = [
    new Topic_1.Topic("Technology"),
    new Topic_1.Topic("Health"),
    new Topic_1.Topic("Sports"),
    new Topic_1.Topic("Beauty"),
    new Topic_1.Topic("Cars"),
    new Topic_1.Topic("Politics")
];
exports.hardCodedDate = new Date('2024-09-01T00:00:00Z');
const articles = [
    Article_1.Article.create("Test Title 1", "John Doe", "This is a test text number 1", exports.hardCodedDate), // 0
    Article_1.Article.create("Test Title 2", "Jane Doe", "This is a test text number 2.", exports.hardCodedDate), // 1
    Article_1.Article.create("Test Title 3", "Axel Springer", "This is a test text number 3.", exports.hardCodedDate), // 2
    Article_1.Article.create("Test Title 4", "Frank Sinatra", "This is a test text number 4.", exports.hardCodedDate), // 3
    Article_1.Article.create("Test Title 5", "Dalai Lama", "This is a test text number 5.", exports.hardCodedDate), // 4
    Article_1.Article.create("Test Title 6", "Michael Jackson", "This is a test text number 6.", exports.hardCodedDate), // 5
    Article_1.Article.create("Test Title 7", "Celion Dion", "This is a test text number 7", exports.hardCodedDate), // 6
    Article_1.Article.create("Test Title 8", "Lorem Ipsum", "This is a test text number 8", exports.hardCodedDate), // 7
    Article_1.Article.create("Test title 9", "Billi Doe", "This is a test text number 9", exports.hardCodedDate), // 8
    Article_1.Article.create("Test title 10", "Bobby Doe", "This is a test text number 10", exports.hardCodedDate) // 9
];
//console.log('Topics initialized:', topics);
//console.log('Articles initialized:', articles);
topics[0].addArticle(articles[0].id);
topics[0].addArticle(articles[1].id);
topics[1].addArticle(articles[2].id);
topics[1].addArticle(articles[3].id);
topics[2].addArticle(articles[4].id);
topics[2].addArticle(articles[5].id);
topics[3].addArticle(articles[6].id);
topics[3].addArticle(articles[7].id);
topics[4].addArticle(articles[8].id);
topics[5].addArticle(articles[9].id);
//console.log('Topics after adding articles:', topics)
exports.dummyDataBase = { topics, articles };
