import express, { Application } from 'express';
import bodyParser from 'body-parser';
import topicController from './controllers/topicController';
import articleController from './controllers/articleController';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;
const app: Application = express();

app.use(bodyParser.json());

// Register routes
app.use('/articles', articleController)
app.use('/topics', topicController); 
app.use('/articles', articleController); 

app.listen(port, () => console.log(`Server is running at: http://127.0.0.1:${port}`));

export default app
 