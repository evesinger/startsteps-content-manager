"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbconfig_1 = __importDefault(require("../configs/dbconfig"));
const createTables = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Creating or updating database schema...');
        // Create topics table
        console.log('Creating topics table...');
        yield (0, dbconfig_1.default) `
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL UNIQUE
      );
    `;
        console.log('Topics table created successfully.');
        // Create articles table
        console.log('Creating articles table...');
        yield (0, dbconfig_1.default) `
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        text TEXT NOT NULL,
        views INT DEFAULT 0, 
        created_at TIMESTAMP DEFAULT NOW(),
        topic_id INT REFERENCES topics(id) ON DELETE SET NULL
      );
    `;
        console.log('Articles table created successfully.');
        // Create ActivityLog table
        console.log('Creating ActivityLog table...');
        yield (0, dbconfig_1.default) `
      CREATE TABLE IF NOT EXISTS activity_log (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL, -- e.g., "Article", "Topic"
        entity_id INT NOT NULL, -- ID of the article or topic
        entity_name VARCHAR(255) NOT NULL, -- Name of the article or topic
        action VARCHAR(50) NOT NULL, -- e.g., "CREATE", "UPDATE", "DELETE"
        timestamp TIMESTAMP DEFAULT NOW() -- Log creation time
      );
    `;
        console.log('ActivityLog table created successfully.');
        console.log('Database schema created or updated successfully.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
});
createTables();
