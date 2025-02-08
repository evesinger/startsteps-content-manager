import sql from "../configs/dbconfig";

const createTables = async () => {
  try {
    console.log("Creating or updating database schema...");

    console.log("Creating topics table...");
    await sql`
      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL UNIQUE, 
        description TEXT NULL,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP NULL DEFAULT NULL,
        deleted_at TIMESTAMP NULL DEFAULT NULL
      );
    `;
    console.log("Topics table created successfully.");

    console.log("Creating articles table...");
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        author_id INT NOT NULL, 
        created_by INT NOT NULL,
        text TEXT NOT NULL,
        image TEXT NULL, 
        views INT DEFAULT 0, 
        created_at TIMESTAMP NULL DEFAULT NULL, 
        updated_at TIMESTAMP NULL DEFAULT NULL, 
        deleted_at TIMESTAMP NULL DEFAULT NULL,
        topic_id INT REFERENCES topics(id) ON DELETE SET NULL
      );
    `;
    console.log("Articles table created successfully.");

    console.log("Creating activity_log table...");
    await sql`
      CREATE TABLE IF NOT EXISTS activity_log (
        id SERIAL PRIMARY KEY,
        entity_id INT NOT NULL, -- ID of the affected entity (article/topic)
        type VARCHAR(50) NOT NULL, -- "Article" or "Topic"
        author_id INT, -- Refers to Java authors but no FK constraint
        action VARCHAR(50) NOT NULL, -- "CREATE", "UPDATE", "DELETE"
        created_at TIMESTAMP DEFAULT NOW(), -- Timestamp when action occurred
        updated_at TIMESTAMP NULL DEFAULT NULL, -- Last modification timestamp
        deleted_at TIMESTAMP NULL DEFAULT NULL  -- Soft deletion timestamp
      );
    `;
    console.log("Activity Log table created successfully.");

    // Now truncate existing data safely
    console.log("Clearing old data...");
    await sql`TRUNCATE TABLE activity_log RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE articles RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE topics RESTART IDENTITY CASCADE;`;
    console.log("Old data cleared.");

    console.log("Database schema created or updated successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  }
};

createTables();