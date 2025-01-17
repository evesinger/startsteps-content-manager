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
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
// Middleware
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Register routes
app.use('/topics', topicController_1.default); // Handles topic-related routes
app.use('/articles', articleController_1.default); // Handles article-related routes
// Get port from environment or use default
const port = process.env.PORT || 5550;
// Start the server
app.listen(port, () => {
    console.log(`Server is running at: http://127.0.0.1:${port}`);
});
