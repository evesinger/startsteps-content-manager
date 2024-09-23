
News Portal Management System
=============================

This is a **RESTful News Portal Management System** that supports basic operations for managing topics and articles. The system is built using **Node.js** **TypeScript** and **Express**, and it allows users to perform CRUD operations on topics and articles.

## Features:

*   Create, delete, list, and show topics
    
*   Create, delete, list, and show articles
    
*   Fetch all articles from a topic
    
*   Fetch the latest 10 articles from any topic (created within the last hour)
    

## Requirements:

*   **Node.js** 

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
    

## Build & Run the Project:

1.  **Create an .env File** : To use environment variables for database configuration or port, create a .env file and add variables like PORT.
    
2.   **Start the code** 
``` bash 
npm start
```
This will start the server on http://localhost:3000 (or the port defined in the .env).
    

## Usage

Below are the API endpoints and example HTTP requests you can use with this system.

### Topic Endpoints

**1. Create a New Topic**

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

**2. Delete a Topic**

Method: DELETE /topics/:topicId

URL Parameters:
- topicId: The ID of the topic to delete

Body:

```bash
DELETE /topics/1
```

Response:
```json
{
  "message": "Topic deleted"
}
```

**3. List All Topics**

Method: GET /topics

Response:
```json
[
  {
    "id": 1,
    "title": "Technology",
    "articleIds": []
  }
] 
```

**4. Show a Specific Topic**

Method: GET /topics/:topicId

URL Parameters:
- topicId: The ID of the topic to fetch

Response:
```json
{
  "id": 1,
  "title": "Technology",
  "articleIds": []
}
```

### Article Endpoints

**1. Create a New Article for a Specific Topic**

Method: POST /topics/:topicId/articles

URL Parameters:
- topicId: The ID of the topic to create an article under

Body:
```json
{
  "title": "New Tech Innovations",
  "author": "John Doe",
  "text": "Exciting new tech in 2023..."
}
```

Response:
```json
{
  "id": 1,
  "title": "New Tech Innovations",
  "author": "John Doe",
  "text": "Exciting new tech in 2023...",
  "date": "2023-01-01T00:00:00Z"
}
```

**2. Delete an Article**
Method: DELETE /topics/:topicId/articles/:articleId

URL Parameters:
- topicId: The ID of the topic to delete from
- articleId: The ID of the article to delete

```bash
DELETE /topics/1/articles/1
```

Response:
```json
{
  "message": "Article deleted"
}
````

**3. List All Articles from a Topic**

Method: GET /topics/:topicId/articles

URL Parameters:
- topicId: The ID of the topic to fetch articles from

Response:

``` json
[
  {
    "id": 1,
    "title": "New Tech Innovations",
    "author": "John Doe",
    "text": "Exciting new tech in 2023...",
    "date": "2023-01-01T00:00:00Z"
  }
]
```
**4. Show a Specific Article**

Method: GET /topics/:topicId/articles/:articleId

URL Parameters:
- topicId: The ID of the topic
- articleId: The ID of the article

Response:
```json
{
  "id": 1,
  "title": "New Tech Innovations",
  "author": "John Doe",
  "text": "Exciting new tech in 2023...",
  "date": "2023-01-01T00:00:00Z"
}
```

**BONUS: Show Latest Articles from Any Topic**
Method: GET /articles/latest

Query Parameters:
- topicId (optional): The ID of the topic to filter by

Response:
```json
[
  {
    "id": 1,
    "title": "New Tech Innovations",
    "author": "John Doe",
    "text": "Exciting new tech in 2023...",
    "date": "2023-01-01T00:00:00Z"
  }
]
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

