import { ArticleRepository } from '../repositories/ArticleRepository';

async function testFindAll() {
  try {
    const articles = await ArticleRepository.findAll();
    console.log("Articles retrieved:", articles);
  } catch (error) {
    console.error("Error in testFindAll:", error);
  }
}

testFindAll();
