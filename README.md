
News Portal Management System
=============================

## Overview

This is a RESTful **News Management System** that supports operations for managing topics, articles, authors, and activity logs.
The system has 2 service: 

- **Content Management**: built by NodeJS, Typescript and ExpressJS
  
- **Author and Auth Service**: built by Java Springboot


### Features:

- Management of topics (CRUD)

- Management of articles (CRUD)
  
- Management of authors (CRUD)
  
- Activity Log of all actions on the platform

- Web/Tablet/Mobile news dashboard preview
  
- Analytics dashboard
  
- User login/registration 

- User profile page 
  
- Author ID based authentication and authorization


### User Roles:
Differrent user have different accesses to the platform.

- **Chief Editors:** 
  Full access to manage authors, articles, topics, and view analytics. 
  Can see all activities in the activity log.
  Can view all analytics.
  Can view any authors profile. 
  <br>

- **Authors**: 
  Limited access to manage only their own articles and view personal analytics.
  Can view only their own profile.



### Requirements:

- **Node.js/Express.js**  (Backend API for topics and articles)

- **TypeScript** (Type safety and better development experience)

- **Spring Boot (Java)** (Microservice for authentication and author management)

- **PostgreSQL** (Database for persistent storage)

- **JEST** for unit testing

### Installation:

Clone the git repo
```bash
clone cd news-portal-management-system
```

Install Dependencies
```bash
npm install
```

Install TypeScript
```bash
npm install -g typescript
```

Compile TypeScript to JavaScript
```bash
tsc
```
Setting up the Local Database: 

1. Start PostgreSQL
  
```bash
pg_ctl -D /usr/local/var/postgres start
```

2. Connect to the Database
```bash
psql -U your_user -d newsmanagement_db
```

4. Create Tables
Run the createTables.js file
```bash
npm run dev dist/database/createTables.js
```

5. Seed Data
Run the seedData.js file for seeding data into the newly  created tables.
```bash
npm run dev dist/database/seedData.js
```
6. Verify the table creation and seeding vere succesfull
   
```bash
psql -U your_user -d newsmanagement_db \dt
```

### Build & Run the Project:

**Create an .env File***

```bash
DATABASE_URL=postgres://your_user:your_password@localhost:5432/newsmanagement_db
PORT=5550
```

**Start the NODEJS Backend Server**
```bash
npm run dev
```

**Verify API Endpoints**
```bash
curl -X GET http://localhost:5550/authors
```

(Alternativetly, you can use [Postman](https://www.postman.com/) for endpoint testng. )

**Running the Java Microservice:**

Navigate to the Java service directory:
```bash
cd author-service
```

Run the Spring Boot application:
```bash
./mvnw spring-boot:run
```

### API Endpoints

**Author and Auth Service**
(Note: use the Java server URL example:localhost:8080)

POST /auth/register - Register as a new author

POST /auth/login - Login and retrieve author_id

PUT /authors/id/update-ontroduction - Authors can update their own intro

GET /authors - Fetch all authors 

GET/authod/id - Get author by id 

PUT/author/id - Update an author by id 

DELETE/author/id - Delete an author by id 

**Content Management Service**
(Note: use the NodeJS server URL example:localhost:3000)

GET /articles - Fetch all articles 

GET /articles/:id - Fetch a single article

GET articles/by-author?author_id=XX - Fetch an article by an author

POST /articles - Create an article

PUT /articles/:id - Update an article

DELETE /articles/:id - Delete an article

GET /activity - View all logs (Chief Editors only)

GET /activity/my-logs - View only the logged-in author's logs


### Running Tests

1. Install dependencies (if not already installed):

2. Run the tests:
```bash
npm test
```

### Future Enhancements
TBC