# Task

Create a Management System for a news portal. The system should support the following operations:

- Create a topic

- Delete a topic

- List all topics

- Show a specific topic

- Create an article for a topic

- Delete an article

- List all articles from a topic

- Show a specific article

Bonus Task:
- Show 10 latest articles of any topic (latest = article was created within the last hour)

The domain objects have the following attributes:

A topic has a title and a list of assigned articles. An article has a title, an author and a text.

The system should be implemented with RESTful web services and stored in a database (it is ok to just implement the wrapper and mock the database for the tests). Please also create some unit tests; a complete code coverage is not necessary. All protocols should be JSON format and needs to be implemented as objects. Please do not use an ORM nor the auto-generation of code, provided by a framework. But you are able to use any framework you want for low-level stuff like routing and response-handling.
