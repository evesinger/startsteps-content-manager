"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicRepository = void 0;
const database_1 = require("../database/database");
const Topic_1 = require("../classes/Topic");
exports.TopicRepository = {
    create(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.initDatabase)();
            const result = yield db.run('INSERT INTO topics (title) VALUES (?)', title);
            return new Topic_1.Topic(title);
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.initDatabase)();
            const row = yield db.get('SELECT * FROM topics WHERE id = ?', id);
            return row ? new Topic_1.Topic(row.title) : null;
        });
    },
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.initDatabase)();
            const rows = yield db.all('SELECT * FROM topics');
            return rows.map(row => new Topic_1.Topic(row.title));
        });
    },
    addArticleToTopic(topicId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.initDatabase)();
            yield db.run('INSERT OR IGNORE INTO topic_articles (topic_id, article_id) VALUES (?, ?)', topicId, articleId);
        });
    },
    removeArticleFromTopic(topicId, articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.initDatabase)();
            yield db.run('DELETE FROM topic_articles WHERE topic_id = ? AND article_id = ?', topicId, articleId);
        });
    },
    getArticlesForTopic(topicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.initDatabase)();
            const rows = yield db.all('SELECT article_id FROM topic_articles WHERE topic_id = ?', topicId);
            return rows.map(row => row.article_id);
        });
    }
};
