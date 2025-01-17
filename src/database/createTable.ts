import sql from '../configs/dbconfig';

const createTables = async () => {
  try {
    console.log('Creating or updating database schema...');

    // Create topics table
    console.log('Creating topics table...');
    await sql`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL UNIQUE
      );
    `;
    console.log('Topics table created successfully.');

    // Create articles table
    console.log('Creating articles table...');
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        topic_id INT REFERENCES topics(id) ON DELETE SET NULL
      );
    `;
    console.log('Articles table created successfully.');

    console.log('Database schema created or updated successfully.');
    process.exit(0); // Exit with success
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1); // Exit with failure
  }
};

createTables();
