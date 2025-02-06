import sql from '../configs/dbconfig';

const createTables = async () => {
  try {
    console.log('Creating or updating database schema...');

    // Topics Table
    console.log('Creating topics table...');
    await sql`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL UNIQUE, 
        description TEXT
      );
    `;
    console.log('Topics table created successfully.');

    // Articles Table (References authors by ID but no foreign key constraint)
    console.log('Creating articles table...');
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author_id INT NOT NULL,
        text TEXT NOT NULL,
        image TEXT, 
        views INT DEFAULT 0, 
        created_at TIMESTAMP NULL, -- ✅ NULL by default, will be set on INSERT
        updated_at TIMESTAMP NULL, -- ✅ Tracks last modification
        deleted_at TIMESTAMP NULL, -- ✅ Tracks when the article was deleted
        topic_id INT REFERENCES topics(id) ON DELETE SET NULL
      );
    `;
    console.log('Articles table created successfully.');
    

    // Activity Log Table
    console.log('Creating activity_log table...');
    await sql`
      CREATE TABLE IF NOT EXISTS activity_log (
        id SERIAL PRIMARY KEY,
        entity_id INT NOT NULL, -- ID of the article or topic
        type VARCHAR(50) NOT NULL, -- e.g., "Article", "Topic"
        author_id INT NOT NULL, -- Store author ID but no foreign key constraint
        action VARCHAR(50) NOT NULL, -- e.g., "CREATE", "UPDATE", "DELETE"
        created_at TIMESTAMP DEFAULT NOW(), -- When the action happened
        updated_at TIMESTAMP NULL, -- When the entity was last updated
        deleted_at TIMESTAMP NULL  -- When the entity was deleted
      );
    `;
    console.log('ActivityLog table created successfully.');
    

    console.log('Database schema created or updated successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
};

createTables();
