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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicRepository = void 0;
const dbconfig_1 = __importDefault(require("../configs/dbconfig"));
class TopicRepository {
    static create(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newTopic] = yield (0, dbconfig_1.default) `
      INSERT INTO topics (title)
      VALUES (${title})
      RETURNING *;
    `;
            return newTopic;
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, dbconfig_1.default) `DELETE FROM topics WHERE id = ${id};`;
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, dbconfig_1.default) `SELECT * FROM topics;`;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [topic] = yield (0, dbconfig_1.default) `SELECT * FROM topics WHERE id = ${id};`;
            return topic;
        });
    }
    static getArticlesForTopic(topicId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, dbconfig_1.default) `
      SELECT articles.*
      FROM articles
      WHERE articles.topic_id = ${topicId};
    `;
        });
    }
    static addArticlesToTopic(topicId, articleIds) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(articleIds.map(articleId => (0, dbconfig_1.default) `
          UPDATE articles
          SET topic_id = ${topicId}
          WHERE id = ${articleId};
        `));
        });
    }
}
exports.TopicRepository = TopicRepository;
