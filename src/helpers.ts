// To be repalced with Joi librry 

//* ADDED: helper function for article data validation
function validateArticleData(title: string, author: string, text: string, createdAt: Date) {
    const errors: string[] = [];
  
    if (!title) errors.push("Title is required");
    if (!author) errors.push("Author is required");
    if (!text) errors.push("Text is required");
  
    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  }

  export default validateArticleData