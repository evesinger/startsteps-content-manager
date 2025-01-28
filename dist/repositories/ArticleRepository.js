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
exports.ArticleRepository = void 0;
const database_1 = require("../database/database");
const Article_1 = require("../classes/Article");
exports.ArticleRepository = {
    create(title, author, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.initDatabase)();
            const result = yield db.run('INSERT INTO articles (title, author, text, created_at) VALUES (?, ?, ?, ?)', title, author, text, new Date());
            const articleId = result.lastID; // Get the ID of the newly created article
            return new Article_1.Article(title, author, text, new Date());
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.initDatabase)();
            const row = yield db.get('SELECT * FROM articles WHERE id = ?', id);
            return row ? new Article_1.Article(row.title, row.author, row.text, new Date(row.created_at)) : null;
        });
    },
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.initDatabase)();
            const rows = yield db.all('SELECT * FROM articles');
            return rows.map(row => new Article_1.Article(row.title, row.author, row.text, new Date(row.created_at)));
        });
    },
    update(id, title, author, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.initDatabase)();
            yield db.run('UPDATE articles SET title = ?, author = ?, text = ? WHERE id = ?', title, author, text, id);
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield (0, database_1.initDatabase)();
            yield db.run('DELETE FROM articles WHERE id = ?', id);
        });
    },
};
