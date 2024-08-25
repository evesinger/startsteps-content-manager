"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dummyDataBase_1 = require("./dummyDataBase");
const Topic_1 = require("./Topic");
const router = express_1.default.Router();
// List all topics
router.get('/', (req, res) => {
    res.json(dummyDataBase_1.dummyDataBase.topics);
});
// Show a specific topic by ID
router.get('/:id', (req, res) => {
    const topicId = parseInt(req.params.id);
    const topic = dummyDataBase_1.dummyDataBase.topics.find(t => t.id === topicId);
    if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
    }
    res.json({ id: topic.id, title: topic.title });
});
// Create a new topic
router.post('/', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Topic title is required" });
    }
    const newTopic = new Topic_1.Topic(title);
    dummyDataBase_1.dummyDataBase.topics.push(newTopic);
    res.status(201).json(newTopic);
});
exports.default = router;
