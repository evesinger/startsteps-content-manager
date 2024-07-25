class Article {
    static articlesSize = 1;
    constructor(title, author, text, createdAt = new Date().toISOString()) {
        this.id = this.getNextId();
        this.title = title;
        this.author = author;
        this.text = text;
        this.createdAt = createdAt;
    }

    getNextId() {
        return Article.articlesSize++;
    }
}

module.exports = Article;
