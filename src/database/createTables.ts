import sql from '../configs/dbconfig';

const createTables = async () => {
  try {
    console.log('Creating or updating database schema...');

        //topics table
        console.log('Creating topics table...');
        await sql`
        CREATE TABLE IF NOT EXISTS topics (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL UNIQUE, 
          description TEXT NULL,
          created_by INT NOT NULL, -- Chief Editor ID (from Java)
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP NULL DEFAULT NULL,
          deleted_at TIMESTAMP NULL DEFAULT NULL
        );
      `;
      console.log("Topics table created successfully.")

    // articles table
    console.log('Creating articles table...');
    await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      author_id INT NOT NULL, -- Refers to Java authors but no constraint
      created_by INT NOT NULL, -- Chief Editor ID (from Java)
      text TEXT NOT NULL,
      image TEXT NULL, 
      views INT DEFAULT 0, 
      created_at TIMESTAMP NULL DEFAULT NULL, 
      updated_at TIMESTAMP NULL DEFAULT NULL, 
      deleted_at TIMESTAMP NULL DEFAULT NULL, 
      topic_id INT REFERENCES topics(id) ON DELETE SET NULL
    );
  `;
  console.log("✅ Articles table created successfully.");

    // Create ActivityLog table
    console.log('Creating ActivityLog table...');
    await sql`
    CREATE TABLE IF NOT EXISTS activity_log (
      id SERIAL PRIMARY KEY,
      entity_id INT NOT NULL, 
      type VARCHAR(50) NOT NULL, 
      author_id INT, 
      action VARCHAR(50) NOT NULL, -- Left it for easier FRONTEND showcasing
      created_at TIMESTAMP DEFAULT NOW(), 
      updated_at TIMESTAMP NULL DEFAULT NULL, 
      deleted_at TIMESTAMP NULL DEFAULT NULL
    );
  `;
  console.log(" Activity Log table created successfully.");

// Turncate existing data
console.log(" Clearing old data...");
    await sql`TRUNCATE TABLE activity_log RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE articles RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE topics RESTART IDENTITY CASCADE;`;
    console.log("Old data cleared.");


    console.log('Database schema created or updated successfully.');
    process.exit(0); 
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1); 
  }
};

createTables();
