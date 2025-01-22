import sql from '../configs/dbconfig';

const createTables = async () => {
  try {
    console.log('Creating or updating database schema...');

    //topics table
    console.log('Creating topics table...');
    await sql`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL UNIQUE
      );
    `;
    console.log('Topics table created successfully.');

    // articles table
    console.log('Creating articles table...');
    await sql`
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
    await sql`
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
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1); 
  }
};

createTables();
