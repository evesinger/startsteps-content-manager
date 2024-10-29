export class Author {
    static authorCounter: number = 1;
    id: number;
    name: string;
    articleIds: number[]; 
  
    constructor(name: string) {
      this.id = Author.authorCounter++,
      this.name = name;
      this.articleIds = []; 
    } }