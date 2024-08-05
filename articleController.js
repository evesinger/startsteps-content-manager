// import class 
const Article = require('./Article')

// import express 
const express = require('express');

let articles = [
    new Article('Article 1', 'Author 1', 'This is the first article', '2024-07-17T12:57:27.125Z'),
    new Article('Article 2', 'Author 2', 'This is the second article', '2024-07-17T12:57:27.125Z'),
    new Article('Article 3', 'Author 3', 'This is the third article', '2024-07-17T12:58:27.125Z')
];

// import router 
const router = express.Router();

router.get('/', (req, res) => { 
    res.json(articles);
 })

module.exports = router
 
