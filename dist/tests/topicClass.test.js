"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Topic_1 = require("../classes/Topic");
describe('Topic Class', () => {
    beforeEach(() => {
        // I reset the topic counter before each test
        Topic_1.Topic.topicCounter = 1;
    });
    // Test Case 1
    test('should create a Topic instance with correct properties', () => {
        const title = 'Sample Topic';
        const topic = new Topic_1.Topic(title);
        expect(topic.id).toBe(1);
        expect(topic.title).toBe(title);
        expect(topic.articleIds).toEqual([]);
    });
    // Test Case 2
    test('should increment topicCounter for each new Topic instance', () => {
        const topic1 = new Topic_1.Topic('Topic 1');
        const topic2 = new Topic_1.Topic('Topic 2');
        const topic3 = new Topic_1.Topic('Topic 3');
        expect(topic1.id).toBe(1);
        expect(topic2.id).toBe(2);
        expect(topic3.id).toBe(3);
    });
    // Test Case 3
    test('addArticle should add an article ID to articleIds', () => {
        const topic = new Topic_1.Topic('Sample Topic');
        topic.addArticle(101);
        topic.addArticle(102);
        expect(topic.articleIds).toEqual([101, 102]);
    });
    // Test Case 4
    test('removeArticle should remove the specified article ID from articleIds', () => {
        const topic = new Topic_1.Topic('Sample Topic');
        topic.addArticle(101);
        topic.addArticle(102);
        topic.addArticle(103);
        topic.removeArticle(102);
        expect(topic.articleIds).toEqual([101, 103]); // 102 should be removed
    });
    // Test Case 5
    test('removeArticle should do nothing if the article ID is not in articleIds', () => {
        const topic = new Topic_1.Topic('Sample Topic');
        topic.addArticle(101);
        topic.addArticle(102);
        topic.removeArticle(999); // trying to remove non existent articles
        expect(topic.articleIds).toEqual([101, 102]);
    });
});
