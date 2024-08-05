class Topic {
    static topicsSize = 1 
    constructor(name) {
      this.id = this.getNextId() 
      this.name = name;
    }
  
    getNextId() {
      return Topic.topicsSize++;
    }
  }
  
  module.exports = Topic;
  