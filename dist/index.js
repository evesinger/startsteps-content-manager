"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const topicController_1 = __importDefault(require("./topicController"));
const articleController_1 = __importDefault(require("./articleController"));
const latestarticleController_1 = __importDefault(require("./latestarticleController"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
// Middleware for parsing JSON bodies
app.use(body_parser_1.default.json());
// Register routes
app.use('/topics', topicController_1.default); // Handles topic-related routes
app.use('/topics', articleController_1.default); // Handles article-related routes nested under topics
app.use('/latest-articles', latestarticleController_1.default); // Handles latest articles route
// Start the server
app.listen(port, () => console.log(`Server is running at: http://127.0.0.1:${port}`));
exports.default = app;
