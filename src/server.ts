import app from './index';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5550;

app.listen(port, () => {
  console.log(`Server is running at: http://127.0.0.1:${port}`);
});