import sql from '../configs/dbconfig';

interface Author {
  id: number;
  firstName: string;
  lastName: string;
}

const JAVA_BACKEND_URL = 'http://localhost:8080/authors'; // Update with your actual Java API URL

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    console.log('Clearing old data...');
    await sql`TRUNCATE TABLE articles RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE topics RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE activity_log RESTART IDENTITY CASCADE;`;
    console.log('Old data cleared.');

        // Fetch authors from Java backend
        console.log('Fetching authors from Java backend...');
        const authorResponse = await fetch(JAVA_BACKEND_URL);
        if (!authorResponse.ok) {
          throw new Error('Failed to fetch authors from Java backend.');
        }
        const authors: Author[] = await authorResponse.json();
        console.log('Fetched authors:', authors);
    

    // Create a mapping of author names to author IDs
    const authorMap = Object.fromEntries(authors.map((author) => [
      `${author.firstName} ${author.lastName}`, author.id
    ]));

    // Insert topics
    console.log('Seeding topics...');
    const topics = await sql`
      INSERT INTO topics (title)
      VALUES 
        ('Technology'),
        ('Science'),
        ('Sport'),
        ('Beauty'),
        ('Politics')
      RETURNING id, title;
    `;
    console.log('Inserted topics:', topics);

    // Log topic creation in ActivityLog
    console.log('Logging topic creation in ActivityLog...');
    for (const topic of topics) {
      await sql`
      INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
      VALUES (${topic.id}, 'Topic', NULL, 'CREATE', NOW());
    `;
    }
    console.log('ActivityLog updated for topics.');

    // Insert articles
    console.log('Seeding articles...');
    const articles = await sql`
      INSERT INTO articles (title, author_id, text, image, topic_id, views)
      VALUES 
        ('Talking Robots: AI in Futurama', ${authorMap['Jane Doe']}, 'Exploring the latest in AI.', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg', ${topics[0].id}, ${Math.floor(Math.random() * 1001)}),
        ('Moonlanding vs UFOs: What NASA Knows', ${authorMap['John Smith']}, 'Mars missions update with UFO theories.', 'https://images.pexels.com/photos/8474990/pexels-photo-8474990.jpeg', ${topics[1].id}, ${Math.floor(Math.random() * 1001)}),
        ('Messi or Ronaldo: The Eternal Debate', ${authorMap['Michael Johnson']}, 'Analyzing football legends.', 'https://images.pexels.com/photos/2413089/pexels-photo-2413089.jpeg', ${topics[2].id}, ${Math.floor(Math.random() * 1001)}),
        ('The Future of Cosmetics', ${authorMap['Sophia Taylor']}, 'How technology is transforming beauty.', 'https://plugins-media.makeupar.com/smb/blog/post/2021-01-28/3ede8f17-1e11-4770-beff-bb029794f560.jpg', ${topics[3].id}, ${Math.floor(Math.random() * 1001)}),
        ('The Politics of Climate Change', ${authorMap['Emily Brown']}, 'How politics affects climate policies.', 'https://img.freepik.com/free-photo/climate-change-with-dry-soil_23-2149217819.jpg', ${topics[4].id}, ${Math.floor(Math.random() * 1001)}),
        ('The Rise of E-sports', ${authorMap['John Smith']}, 'Exploring competitive gaming.', 'https://plus.unsplash.com/premium_photo-1683141331949-64810cfc4ca3', ${topics[2].id}, ${Math.floor(Math.random() * 1001)}),
        ('AI in Sports Coaching', ${authorMap['Jane Doe']}, 'How AI is transforming sports.', 'https://www.unite.ai/wp-content/uploads/2024/03/Football.webp', ${topics[0].id}, ${Math.floor(Math.random() * 1001)}),
        ('Memes in Politics', ${authorMap['Michael Johnson']}, 'The role of memes in elections.', 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg', ${topics[4].id}, ${Math.floor(Math.random() * 1001)})
      RETURNING id, title, author_id;
    `;
    console.log('Inserted articles:', articles);

    // Log article creation in ActivityLog
    console.log('Logging article creation in ActivityLog...');
    for (const article of articles) {
      const authorId = article.author_id;
      const authorName = Object.keys(authorMap).find(name => authorMap[name] === authorId) || 'Unknown';

      await sql`
      INSERT INTO activity_log (entity_id, type, author_id, action, created_at)
      VALUES (${article.id}, 'Article', ${article.author_id}, 'CREATE', NOW());
    `;
    }
    console.log('ActivityLog updated for articles.');

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
