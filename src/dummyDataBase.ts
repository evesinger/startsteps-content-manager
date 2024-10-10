import { Topic } from './Topic';
import { Article } from './Article';


const topics: Topic[] = [
  new Topic("Technology"), 
  new Topic("Health"),
  new Topic("Sports"),
  new Topic ("Beauty"), 
  new Topic ("Cars"),
  new Topic ("Politics")
];

export const hardCodedDate = new Date('2024-09-01T00:00:00Z');

const articles: Article[] = [
  Article.create("Test Title 1","John Doe", "This is a test text number 1", hardCodedDate ), // 0
  Article.create("Test Title 2", "Jane Doe", "This is a test text number 2.", hardCodedDate), // 1
  Article.create("Test Title 3", "Axel Springer", "This is a test text number 3.", hardCodedDate), // 2
  Article.create("Test Title 4", "Frank Sinatra", "This is a test text number 4.", hardCodedDate),// 3
  Article.create("Test Title 5", "Dalai Lama", "This is a test text number 5.", hardCodedDate), // 4
  Article.create("Test Title 6", "Michael Jackson", "This is a test text number 6.",hardCodedDate), // 5
  Article.create("Test Title 7", "Celion Dion", "This is a test text number 7", hardCodedDate), // 6
  Article.create("Test Title 8", "Lorem Ipsum", "This is a test text number 8", hardCodedDate), // 7
  Article.create("Test title 9", "Billi Doe", "This is a test text number 9", hardCodedDate),// 8
  Article.create("Test title 10", "Bobby Doe", "This is a test text number 10", hardCodedDate) // 9
];

//console.log('Topics initialized:', topics);
//console.log('Articles initialized:', articles);

topics[0].addArticle(articles[0].id); 
topics[0].addArticle(articles[1].id); 
topics[1].addArticle(articles[2].id); 
topics[1].addArticle(articles[3].id); 
topics[2].addArticle(articles[4].id); 
topics[2].addArticle(articles[5].id); 
topics[3].addArticle(articles[6].id); 
topics[3].addArticle(articles[7].id); 
topics[4].addArticle(articles[8].id); 
topics[5].addArticle(articles[9].id); 

//console.log('Topics after adding articles:', topics)

export const dummyDataBase = { topics, articles };



