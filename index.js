const express = require('express');
const app = express();

app.use(express.json());

const port = 3001;

app.get('/', (req, res) => {
  res.send("Hello World!");
});

const articlesRouter = require('./articleController.js');
app.use('/articles', articlesRouter);

const topicsRouter = require('./topiccontroller.js');
app.use('/topics', topicsRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
