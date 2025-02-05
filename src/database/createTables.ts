import sql from '../configs/dbconfig';

const createTables = async () => {
  try {
    console.log('Creating or updating database schema...');

     // Authors table
     console.log('Creating authors table...');
     await sql`
       CREATE TABLE IF NOT EXISTS authors (
         id SERIAL PRIMARY KEY,
         first_name TEXT NOT NULL,
         last_name TEXT NOT NULL,
         email VARCHAR(255) UNIQUE NOT NULL,
         password TEXT NOT NULL,
         profile_image TEXT
         introduction TEXT NULL
       );
     `;
     console.log('Authors table created successfully.');

    //topics table
    console.log('Creating topics table...');
    await sql`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL UNIQUE, 
        description TEXT
      );
    `;
    console.log('Topics table created successfully.');

    // articles table
    console.log('Creating articles table...');
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author_id INT NOT NULL REFERENCES authors(id) ON DELETE SET NULL,
        text TEXT NOT NULL,
        image TEXT,
        views INT DEFAULT 0, 
        topic_id INT REFERENCES topics(id) ON DELETE SET NULL
      );
    `;
    console.log('Articles table created successfully.');

    // Create ActivityLog table
    console.log('Creating ActivityLog table...');
    await sql`
      CREATE TABLE IF NOT EXISTS activity_log (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        entity_id INT NOT NULL,
        entity_name VARCHAR(255) NOT NULL,
        author_id INT NOT NULL REFERENCES authors(id) ON DELETE SET NULL, -- Stores author ID
        author_first_name TEXT NOT NULL,
        author_last_name TEXT NOT NULL,
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
