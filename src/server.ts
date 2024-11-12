import app from './index';

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running at: http://127.0.0.1:${port}`));
