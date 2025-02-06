import sql from "../configs/dbconfig";

interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

const JAVA_BACKEND_URL = "http://localhost:8080/authors"; // Java backend for fetching authors
const CHIEF_EDITOR_ID = 2; // ✅ Chief Editor ID for seeding

const seedDatabase = async () => {
  try {
    console.log("🚀 Starting database seeding...");

    // Clear existing data
    console.log("🗑 Clearing old data...");
    await sql`TRUNCATE TABLE articles RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE topics RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE activity_log RESTART IDENTITY CASCADE;`;
    console.log("✅ Old data cleared.");

    // Fetch authors from Java backend
    console.log("🔄 Fetching authors from Java backend...");
    const authorResponse = await fetch(JAVA_BACKEND_URL);
    if (!authorResponse.ok) {
      throw new Error("❌ Failed to fetch authors from Java backend.");
    }
    const authors: Author[] = await authorResponse.json();
    console.log("✅ Fetched authors:", authors);

    // Create a mapping of author IDs by first & last name
    const authorMap = new Map();
    authors.forEach((author) => {
      const fullName = `${author.firstName.trim()} ${author.lastName.trim()}`;
      authorMap.set(fullName, author.id);
    });
    console.log("✅ Author Map:", authorMap);

    // Convert authorMap to an array for random selection
    const authorIds = Array.from(authorMap.values());

    if (authorIds.length === 0) {
      throw new Error("❌ No authors were found! Stopping seeding process.");
    }

    // Insert topics with created_by
    console.log("📝 Seeding topics...");
    const topics = await sql`
      INSERT INTO topics (title, description, created_by)
      VALUES 
        ('Technology', 'Latest in tech', ${CHIEF_EDITOR_ID}),
        ('Science', 'New discoveries', ${CHIEF_EDITOR_ID}),
        ('Sport', 'Sports updates', ${CHIEF_EDITOR_ID}),
        ('Beauty', 'Fashion & cosmetics', ${CHIEF_EDITOR_ID}),
        ('Politics', 'World politics', ${CHIEF_EDITOR_ID})
      RETURNING id, title;
    `;
    console.log("✅ Inserted topics:", topics);

    // Ensure topics exist
    if (topics.length === 0) {
      throw new Error("❌ No topics were inserted! Stopping seeding process.");
    }

    // Log topic creation in ActivityLog
    console.log("📜 Logging topic creation in ActivityLog...");
    for (const topic of topics) {
      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
        VALUES (${topic.id}, 'Topic', ${CHIEF_EDITOR_ID}, 'CREATE', NOW());
      `;
    }
    console.log("✅ ActivityLog updated for topics.");

    // Define article templates (without hardcoded authors)
    const articlesData = [
      { title: "Talking Robots: AI in Futurama", text: "Exploring the latest in AI.", image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg", topicTitle: "Technology" },
      { title: "Moonlanding vs UFOs: What NASA Knows", text: "Mars missions update with UFO theories.", image: "https://images.pexels.com/photos/8474990/pexels-photo-8474990.jpeg", topicTitle: "Science" },
      { title: "Messi or Ronaldo: The Eternal Debate", text: "Analyzing football legends.", image: "https://images.pexels.com/photos/2413089/pexels-photo-2413089.jpeg", topicTitle: "Sport" },
      { title: "The Future of Cosmetics", text: "How technology is transforming beauty.", image: "https://plugins-media.makeupar.com/smb/blog/post/2021-01-28/3ede8f17-1e11-4770-beff-bb029794f560.jpg", topicTitle: "Beauty" },
      { title: "The Politics of Climate Change", text: "How politics affects climate policies.", image: "https://img.freepik.com/free-photo/climate-change-with-dry-soil_23-2149217819.jpg", topicTitle: "Politics" }
    ];

    console.log("📝 Seeding articles...");
    for (const article of articlesData) {
      // Select a random author ID from `authorIds`
      const authorId = authorIds[Math.floor(Math.random() * authorIds.length)];

      // Find the topic by name
      const topic = topics.find((t) => t.title === article.topicTitle);

      console.log(`🔎 Processing article: ${article.title}`);
      console.log(`   → Selected Author ID: ${authorId}`);
      console.log(`   → Topic: ${article.topicTitle} (ID: ${topic?.id})`);

      if (!authorId) {
        console.error(`❌ Error: No author_id found. Skipping article.`);
        continue;
      }

      if (!topic) {
        console.error(`❌ Error: No topic_id found for ${article.topicTitle}. Skipping article.`);
        continue;
      }

      // Insert article
      const [newArticle] = await sql`
        INSERT INTO articles (title, author_id, created_by, text, image, topic_id, created_at, views)
        VALUES (${article.title}, ${authorId}, ${CHIEF_EDITOR_ID}, ${article.text}, ${article.image}, ${topic.id}, NOW(), 0)
        RETURNING *;
      `;
      console.log(`✅ Inserted article: ${newArticle.title} (ID: ${newArticle.id})`);

      // Log article creation in ActivityLog
      await sql`
        INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
        VALUES (${newArticle.id}, 'Article', ${newArticle.author_id}, 'CREATE', NOW());
      `;
    }

    console.log("✅ ActivityLog updated for articles.");
    console.log("🎉 Database seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
