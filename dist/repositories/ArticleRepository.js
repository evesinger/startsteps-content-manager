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
exports.ArticleRespository = void 0;
const dbconfig_1 = __importDefault(require("../configs/dbconfig"));
class ArticleRespository {
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, dbconfig_1.default) `SELECT * FROM articles`;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [article] = yield (0, dbconfig_1.default) `SELECT * FROM articles WHERE id = ${id}`;
            return article;
        });
    }
    static create(title, author, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const [newArticle] = yield (0, dbconfig_1.default) `
    INSERT INTO articles (title, author, text, created_at)
    VALUE (${title}, ${author}, ${text}
    RETURNING *`;
            return newArticle;
        });
    }
    static update(id, title, author, text) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, dbconfig_1.default) `
    UPDATE articles 
    SET title = ${title}, author = ${author}, text = ${text}
    WHERE id= ${id}`;
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, dbconfig_1.default) `DELETE FROM articles WHERE id = ${id}`;
        });
    }
    static findLatest(since) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, dbconfig_1.default) `
    SELECT * FROM articles 
    WHERE created_at > ${since}
    ORDER BY created_at DESC
    LIMIT 10`;
        });
    }
}
exports.ArticleRespository = ArticleRespository;
