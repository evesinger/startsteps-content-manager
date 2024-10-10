
News Portal Management System
=============================

This is a **RESTful News Portal Management System** that supports basic operations for managing topics and articles. 
The system is built using **Node.js** **TypeScript** and **Express**, and it allows users to perform CRUD operations on topics and articles.

You can find the full Task Decription [here.](task.md)



## Features:

*   Create, delete, list, and show topics
    
*   Create, delete, list, and show articles
    
*   Fetch all articles from a topic
    
*   Fetch the latest 10 articles from any topic (created within the last hour)
    

## Requirements:

*   **Node.js/Express.js** 

*   **TypeScript** 
  
*   **npm**  for package management
    

## Installation:

1. **Clone the git repo**
```bash
clone cd news-portal-management-system
```
    
2. **Install Dependencies**

```bash
npm install
```
3. **Install TypeScript**

```bash
npm install -g typescript

```

4. **Compile TypeScript to JavaScript**
```bash
tsc
```
NOTE: this command can be renamed in the package.json file, under "scripts".

    

## Build & Run the Project:

1.  **Create an .env File** : To use environment variables for database configuration or port, create a .env file and add variables like PORT.

&nbsp;
    
2.   **Start the code** 
``` bash 
npm start
```
This will start the server on http://localhost:3000 (or the port defined in the .env).

&nbsp;

3. **Verify the project is running**

To verify the app is running, open your browser or use a tool like Postman and navigate to:
``` bash 
GET http://localhost:3000/
```
Your Response should be: 
``` bash 
Welcome!
```

## Usage Example (Optional)

You can add one example endpoint to test the API further.

**1. Creating a New Topic**

Method: POST /topics

Body:
```json
{
  "title": "Technology"
}
```

Response:
```json
{
  "id": 1,
  "title": "Technology",
  "articleIds": []
}
```

## Folder Structure:
```bash
news-portal-management-system/
│
├── src/
│   ├── index.ts                # Main server entry point
│   ├── topicController.ts      # Topic routes and logic
│   ├── articleController.ts    # Article routes and logic
│   ├── dummyDataBase.ts        # Mocked in-memory database
│   └── Article.ts              # Article Class
│
├── test/
│   └── topic.test.ts           # Unit tests for topic operations
│
├── package.json                # Project dependencies and scripts
├── README.md                   # Project documentation
└── .env                        # Environment variables
```

