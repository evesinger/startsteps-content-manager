import sql from '../configs/dbconfig';

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    console.log('Clearing old data...');
    await sql`TRUNCATE TABLE articles RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE topics RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE activity_log RESTART IDENTITY CASCADE;`; // Fixed table name
    await sql`TRUNCATE TABLE authors RESTART IDENTITY CASCADE;`;
    console.log('Old data cleared.');

    //Password as text 
    const simplePassword = "kaching12345!"


    // Insert authors
    const authors = await sql`
      INSERT INTO authors (first_name, last_name, email, profile_image, password)
      VALUES 
      ('Jane', 'Doe', 'jane.doe@example.com', 'https://randomuser.me/api/portraits/women/1.jpg', ${simplePassword}),
      ('John', 'Smith', 'john.smith@example.com', 'https://randomuser.me/api/portraits/men/1.jpg', ${simplePassword}),
      ('Emily', 'Brown', 'emily.brown@example.com', 'https://randomuser.me/api/portraits/women/2.jpg', ${simplePassword}),
      ('Michael', 'Johnson', 'michael.johnson@example.com', 'https://randomuser.me/api/portraits/men/2.jpg', ${simplePassword}),
      ('Sophia', 'Taylor', 'sophia.taylor@example.com', 'https://randomuser.me/api/portraits/women/3.jpg', ${simplePassword})
      RETURNING id, first_name, last_name;
    `;
    console.log('Inserted authors:', authors);

    // Create a mapping of author names to author IDs
    const authorMap = Object.fromEntries(authors.map((author) => [
      `${author.first_name} ${author.last_name}`, author.id
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
        INSERT INTO activity_log (type, entity_id, entity_name, author_id, author_name, action)
        VALUES ('Topic', ${topic.id}, ${topic.title}, NULL, NULL, 'CREATE');
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
        INSERT INTO activity_log (type, entity_id, entity_name, author_id, author_name, action)
        VALUES ('Article', ${article.id}, ${article.title}, ${authorId}, ${authorName}, 'CREATE');
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
