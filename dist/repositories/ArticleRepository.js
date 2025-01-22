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
exports.ArticleRepository = void 0;
const dbconfig_1 = __importDefault(require("../configs/dbconfig"));
class ArticleRepository {
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, dbconfig_1.default) `
      SELECT id, title, author, text, image, created_at, topic_id, views 
      FROM articles;
    `;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [article] = yield (0, dbconfig_1.default) `
      SELECT id, title, author, text, image, created_at, topic_id, views 
      FROM articles 
      WHERE id = ${id};
    `;
            return article;
        });
    }
    // With random views for stats
    static create(title, author, text, image, topicId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Step 1: Insert the article with 0 views initially
            const [newArticle] = yield (0, dbconfig_1.default) `
      INSERT INTO articles (title, author, text, image, topic_id, created_at, views)
      VALUES (${title}, ${author}, ${text}, ${image}, ${topicId}, DEFAULT, 0)
      RETURNING *;
    `;
            // Step 2: Schedule an update for views after 5 seconds
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Generate a random number for views (e.g., between 50 and 1000)
                    const randomViews = Math.floor(Math.random() * (1000 - 50 + 1)) + 50;
                    yield (0, dbconfig_1.default) `
          UPDATE articles
          SET views = ${randomViews}
          WHERE id = ${newArticle.id};
        `;
                    console.log(`Views updated to ${randomViews} for article ID: ${newArticle.id}`);
                }
                catch (error) {
                    console.error(`Error updating views for article ID: ${newArticle.id}`, error);
                }
            }), 5000);
            return newArticle;
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(data);
            const values = Object.values(data);
            if (keys.length === 0) {
                throw new Error("No fields to update");
            }
            // Dynamically construct the SET clause
            const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
            // Add the ID to the list of values
            values.push(id);
            // Execute the query
            const query = `
      UPDATE articles
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;
            const [updatedArticle] = yield dbconfig_1.default.unsafe(query, values);
            return updatedArticle;
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, dbconfig_1.default) `
      DELETE FROM articles 
      WHERE id = ${id};
    `;
        });
    }
}
exports.ArticleRepository = ArticleRepository;
