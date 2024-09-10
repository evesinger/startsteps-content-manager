import express, { Application } from 'express';
import bodyParser from 'body-parser';
import topicController from './topicController';
import articleController from './articleController';
// import latestarticleController from './latestarticleController';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;
const app: Application = express();

app.use(bodyParser.json());

// Register routes
app.use('/topics', topicController); // Handles topic-related routes
app.use('/articles', articleController); // Handles article-related routes
// app.use('/latest-articles', latestarticleController); // Handles latest articles route

app.listen(port, () => console.log(`Server is running at: http://127.0.0.1:${port}`));

export default app
 