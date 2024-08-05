const Topic = require('./Topic')
const express = require('express')

let topics = [
  new Topic("Technologie"),
  new Topic("Gesundheit"),
  new Topic("Sport")
];

const router = express.Router()

router.get('/', (req, res) => {
  res.json(topics);
});

router.get('/:id', (req, res) => {
  const topicId = parseInt(req.params.id);
  const topic = topics.find(t => t.id === topicId);
  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  res.json(topic);
});

router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newTopic = new Topic(name);
  topics.push(newTopic);
  res.status(201).json(newTopic);
});

module.exports = router;
