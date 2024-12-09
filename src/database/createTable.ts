import sql from '../configs/dbconfig'; 

const createTables = async () => {
  try {
    console.log('Creating topics table...');
    await sql`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL UNIQUE
      );
    `;
    console.log('Topics table created successfully.');

    console.log('Modifying articles table...');
    await sql`
      ALTER TABLE articles
      ADD COLUMN IF NOT EXISTS topic_id INT REFERENCES topics(id) ON DELETE SET NULL;
    `;
    console.log('Articles table modified successfully.');

    process.exit(0); // Exit the script successfully
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1); // Exit with an error code
  }
};

createTables();
