// Import the Express.js library
const express = require('express');

// Create an instance of an Express application
const app = express();

app.use(express.json()); // configuration 

// Define the port number the server will listen on
const port = 3000;

// Define a route handler for the root URL ('/')
app.get('/', (req, res) => {
  // When a GET request is made to the root URL, send the text 'Hello World!' as a response
  res.send("Hello World!");
});

const articlesRouter = require('./articleController.js'); // Import the router correctly
app.use('/articles', articlesRouter); // Use the router directly

// Start the server and have it listen on the specified port
app.listen(port, () => {
  // Log a message to the console indicating that the server is running and on which port it is accessible
  console.log(`Example app listening at http://localhost:${port}`);
});
