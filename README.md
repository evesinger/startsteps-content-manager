
News Portal Management System
=============================

## Overview

This is project is part of a RESTful **News Management System** that supports operations for managing topics, articles, authors, and activity logs.

This project is the **Content Management Service**, which is built by NodeJS, Typescript and ExpressJS.


### Features:

- Role based management of Topics (CRUD)

- Role based management of Articles (CRUD)
  
- Role based Activity Log of all actions on the platform
  
- Analytics dashboard 
  
- Search controller
  


### User Roles:
Differrent user have different accesses to content management:

- **Chief Editors:** 
  Full access to manage articles, topics, and view analytics. 
  Can see all activities in the activity log.
  Can view all analytics.
  <br>

- **Authors**: 
  Limited access to manage only their own articles and view their own activity-log.



### Requirements:

- **Node.js/Express.js**  (Backend API for topics,  articles and activity)

- **TypeScript** (Type safety and better development experience)

- **PostgreSQL** (Database for persistent storage)

- **JEST** (for unit testing)

### Installation:

#### Clone the git repo
```bash
clone cd news-portal-management-system
```

#### Install Dependencies
```bash
npm install
```

#### Install TypeScript
```bash
npm install -g typescript
```

#### Compile TypeScript to JavaScript
```bash
tsc
```
#### Setting up the Local Database: 

**1. Start PostgreSQL**
  
```bash
pg_ctl -D /usr/local/var/postgres start
```

**2. Connect to the Database**
```bash
psql -U your_user -d newsmanagement_db
```

**4. Create Tables
Run the createTables.js file**
```bash
npm run dev dist/database/createTables.js
```

**5. Seed Data**

**! IMPORTANT:** In order to run the seedData.js succesfully you MUST run the [Java backend service](https://github.com/evesinger/startsteps-author-service) of the first. You can find more information by clicking on the project.

Once it is running, start the seedData.js file for seeding data into the newly  created tables.
```bash
npm run dev dist/database/seedData.js
```
1. Verify that the table creation and seeding were succesfull
   
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
curl -X GET http://localhost:5550/articles
```

(Alternativetly, you can use [Postman](https://www.postman.com/) for endpoint testng. )

### API Endpoints

Use the following key-value pair in your headers for role based permissions with every request:

x-author-id: 5
x-user-role: AUTHOR 

OR

x-auhor-id: 1 
x-user-role: CHIEF_EDITOR

#### **Article Related Endpoints**

**GET /articles**- Fetch all articles 
- Accessible for Authors and Chief Editors
- Expected response: 200OK

**GET /articles/:id** - Fetch a single article
- Only Chief Editor have access to any article by id
- Authors can access only their own articles
- Expected response: 200OK

**GET articles/by-author?author_id=XX** - Fetch an article by an author
- Only Chief Editor access to any article by id
- Expected response: 200OK

**POST /articles** - Create an article
- Accessible for Authors and Chief Editors
- Expected response: 201Created

**PUT /articles/:id**- Update an article
- Only Chief Editor can update any article by id
- Authors can update only their own articles
- Expected response: 200OK

**DELETE /articles/:id** - Delete an article
- Only Chief Editor can delete any article
- Authors can delete only their own articles
- Expected response: 200OK

#### **Topics Related Endpoints**

**GET /topics**- Fetch all topics
- Accessible for Authors and Chief Editors
- Expected response: 200OK

**GET /articles/:id** - Fetch a single topic
- Only Chief Editor have access to any single topic
- Expected response: 200OK

**POST /topics** - Create a topic
- Accessible only for Chief Editors
- Expected response: 201Created

**DELETE /articles/:id** - Delete a topic
- Only Chief Editor can delete any article
- Expected response: 200OK

**PUT /topics/:id/articles/:id** - Link a topic to an article
- Accessible for Authors and Chief Editors
- Expected response: 200OK

#### **Activity Related Endpoints**

**GET /activity** - View all activity logs
- Only Chief Editor can delete any article
- Expected response: 200OK

**GET /activity/my-logs** - View only the logged-in author's logs
- Only Authors can access it
- Expected response: 200OK

In cases of unathorized requests, the response should be 403Forbidden.

### Running Tests

1. Install dependencies (if not already installed):

2. Run the tests:
```bash
npm test
```

### Future Enhancements

**Decoupling Node.js from Java**:
- Move Java author data to its own PostgreSQL DB (separate from Node.js).
- Node.js will sync only necessary author data (to avoid direct dependency).
- Redis Pub/Sub for real-time updates when authors change.

**Advanced Search & Filtering**
- Full-text search with PostgreSQL tsvector or Elasticsearch.

**Authentication & Security**
- implementing JWT authentication 
- OAuth support (Google, GitHub).
- Password hashing 
  
**Role-Based Access Control (RBAC)**
-More granular roles (e.g., Senior Editors, Contributors, Moderators).

**CI/CD & Deployment**
- GitHub Actions for automated testing.
- Docker & Kubernetes for scalability.