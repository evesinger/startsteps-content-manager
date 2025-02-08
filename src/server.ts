import express, { Application } from 'express';
import bodyParser from 'body-parser';
import topicController from './controllers/topicController';
import articleController from './controllers/articleController';
import activityController from './controllers/activityController';
import searchController from './controllers/searchController';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Application = express();

//Middlewares
app.use(bodyParser.json());
app.use(cors());

//Routes 
app.use('/topics', topicController); 
app.use('/articles', articleController); 
app.use('/activity',activityController);  
app.use('/search', searchController);

const port = process.env.PORT || 5550;

app.listen(port, () => {
  console.log(`Server is running at: http://127.0.0.1:${port}`);
});