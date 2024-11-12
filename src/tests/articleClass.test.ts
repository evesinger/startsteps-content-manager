import { Article } from "../classes/Article";

describe('Article Class', () => {
  beforeEach(() => {
    // Reset articleCounter for each test case
    Article.articleCounter = 1
  });

// Test Case 1
  test('should create an Article instance with correct properties', () => {
    const title = 'Test Title';
    const author = 'Author Name';
    const text = 'This is the article text.';
    const createdAt = new Date('2023-11-01T10:00:00Z');

    const article = new Article(title, author, text, createdAt);

    expect(article.id).toBe(1);  
    expect(article.title).toBe(title);
    expect(article.author).toBe(author);
    expect(article.text).toBe(text);
    expect(article.createdAt).toBe(createdAt);
  })

// Test Case 2

  test('should increment articleCounter for each new Article instance', () => {
    const article1 = new Article('Title 1', 'Author 1', 'Text 1', new Date());
    const article2 = new Article('Title 2', 'Author 2', 'Text 2', new Date());
    const article3 = new Article('Title 3', 'Author 3', 'Text 3', new Date());

    expect(article1.id).toBe(1);
    expect(article2.id).toBe(2);
    expect(article3.id).toBe(3);
  })

  // Test case 3
  test('should allow setting of custom createdAt date', () => {
    const customDate = new Date('2023-11-01T12:00:00Z');
    const article = new Article('Title', 'Author', 'Text', customDate);

    expect(article.createdAt).toBe(customDate)
  })
});