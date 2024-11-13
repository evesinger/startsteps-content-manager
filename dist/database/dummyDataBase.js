"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dummyDataBase = exports.hardCodedDate = void 0;
const Topic_1 = require("../classes/Topic");
const Article_1 = require("../classes/Article");
const Author_1 = require("../classes/Author");
const topics = [
    new Topic_1.Topic("Technology"),
    new Topic_1.Topic("Health"),
    new Topic_1.Topic("Sports"),
    new Topic_1.Topic("Beauty"),
    new Topic_1.Topic("Cars"),
    new Topic_1.Topic("Politics")
];
const authors = [
    new Author_1.Author("Sarah B."),
    new Author_1.Author("Ken F."),
    new Author_1.Author("Tobis K."),
    new Author_1.Author("Lila L."),
    new Author_1.Author("Emma S.")
];
exports.hardCodedDate = new Date('2024-09-01T00:00:00Z');
const articles = [
    Article_1.Article.create("Test Title 1", authors[0], "This is a test text number 1", exports.hardCodedDate), // 0
    Article_1.Article.create("Test Title 2", authors[1], "This is a test text number 2.", exports.hardCodedDate), // 1
    Article_1.Article.create("Test Title 3", authors[2], "This is a test text number 3.", exports.hardCodedDate), // 2
    Article_1.Article.create("Test Title 4", authors[3], "This is a test text number 4.", exports.hardCodedDate), // 3
    Article_1.Article.create("Test Title 5", authors[4], "This is a test text number 5.", exports.hardCodedDate), // 4
    Article_1.Article.create("Test Title 6", authors[4], "This is a test text number 6.", exports.hardCodedDate), // 5
    Article_1.Article.create("Test Title 7", authors[3], "This is a test text number 7", exports.hardCodedDate), // 6
    Article_1.Article.create("Test Title 8", authors[2], "This is a test text number 8", exports.hardCodedDate), // 7
    Article_1.Article.create("Test title 9", authors[1], "This is a test text number 9", exports.hardCodedDate), // 8
    Article_1.Article.create("Test title 10", authors[0], "This is a test text number 10", exports.hardCodedDate) // 9
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
