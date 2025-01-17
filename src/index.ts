import express, { Application } from 'express';
import bodyParser from 'body-parser';
import topicController from './controllers/topicController';
import articleController from './controllers/articleController';
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

const port = process.env.PORT || 3000;
const app: Application = express();

app.use(bodyParser.json());
app.use(cors());

// Register routes
app.use('/articles', articleController)
app.use('/topics', topicController); 
app.use('/articles', articleController); 


export default app
 