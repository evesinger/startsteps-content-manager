import express, { Application } from 'express';
import bodyParser from 'body-parser';
import topicController from './controllers/topicController';
import articleController from './controllers/articleController';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Register routes
app.use('/topics', topicController); // Handles topic-related routes
app.use('/articles', articleController); // Handles article-related routes

// Get port from environment or use default
const port = process.env.PORT || 5550;

// Start the server
app.listen(port, () => {
  console.log(`Server is running at: http://127.0.0.1:${port}`);
});
