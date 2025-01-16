"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const topicController_1 = __importDefault(require("./controllers/topicController"));
const articleController_1 = __importDefault(require("./controllers/articleController"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Register routes
app.use('/topics', topicController_1.default); // Handles topic-related routes
app.use('/articles', articleController_1.default); // Handles article-related routes
exports.default = app;
