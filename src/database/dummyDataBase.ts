import { Topic } from '../classes/Topic';
import { Article } from '../classes/Article';
import { Author } from '../classes/Author';


const topics: Topic[] = [
  new Topic("Technology"), 
  new Topic("Health"),
  new Topic("Sports"),
  new Topic ("Beauty"), 
  new Topic ("Cars"),
  new Topic ("Politics")
];

const authors: Author[] = [
  new Author ("Sarah B."),
  new Author ("Ken F."),
  new Author ("Tobis K."),
  new Author ("Lila L."),
  new Author ("Emma S.")
]

export const hardCodedDate = new Date('2024-09-01T00:00:00Z');

const articles: Article[] = [
  Article.create("Test Title 1", authors[0],"This is a test text number 1", hardCodedDate ), // 0
  Article.create("Test Title 2", authors[1], "This is a test text number 2.", hardCodedDate), // 1
  Article.create("Test Title 3", authors[2], "This is a test text number 3.", hardCodedDate), // 2
  Article.create("Test Title 4", authors[3], "This is a test text number 4.", hardCodedDate),// 3
  Article.create("Test Title 5", authors[4], "This is a test text number 5.", hardCodedDate), // 4
  Article.create("Test Title 6", authors[4], "This is a test text number 6.",hardCodedDate), // 5
  Article.create("Test Title 7", authors[3], "This is a test text number 7", hardCodedDate), // 6
  Article.create("Test Title 8", authors[2],"This is a test text number 8", hardCodedDate), // 7
  Article.create("Test title 9", authors[1],"This is a test text number 9", hardCodedDate),// 8
  Article.create("Test title 10",authors[0], "This is a test text number 10", hardCodedDate) // 9
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



