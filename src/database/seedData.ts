import sql from '../configs/dbconfig';

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // clear existing data
    console.log('Clearing old data...');
    await sql`TRUNCATE TABLE articles RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE topics RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE activity_log RESTART IDENTITY CASCADE;`;
    await sql `TURNCATE TABLE authors RESTART IDENTITY CASCADE;`;
    console.log('Old data cleared.');

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
    console.log('Inserting topics...');
    const topics = await sql`
      INSERT INTO topics (title, description, created_at)
      VALUES 
        ('Technology', 'All things technology'),
        ('Science', 'All things science'),
        ('Sport', 'All things sports'),
        ('Beauty', 'All things beauty'),
        ('Politics', 'All things politics')
      RETURNING *;
    `;
    console.log('Inserted topics:', topics);

    // activity log for inserted topics
    console.log('Logging topic creation in ActivityLog...');
    for (const topic of topics) {
      await sql`
        INSERT INTO activitylog (type, entity_id, entity_name, author_id, author_first_name, author_last_name, action)
        VALUES ('Topic Created', ${topic.id}, ${topic.title}, NULL, NULL, 'CREATE');
      `;
    }
    console.log('ActivityLog updated for topics.');

// insert articles
    console.log('Inserting articles...');
    const articles = await sql`
      INSERT INTO articles (title, author_id, text, image, topic_id, views)
      VALUES 
        ('Talking Robots: AI in Futurama',  ${authorMap['Jane Doe']}, 'Exploring the latest in AI, as seen in Futurama.', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ${topics[0].id}, ${Math.floor(Math.random() * 1001)}),
        ('Moonlanding vs UFOs: What NASA Knows',  ${authorMap['John Smith']}, 'Mars missions update with some thoughts on UFO encounters.', 'https://images.pexels.com/photos/8474990/pexels-photo-8474990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ${topics[1].id}, ${Math.floor(Math.random() * 1001)}),
        ('What is Modern Art? A Digital Revolution',  ${authorMap['Michael Johsnon']}, 'Exploring the rise of digital art and how technology is changing creativity.', 'https://images.pexels.com/photos/5033989/pexels-photo-5033989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ${topics[4].id}, ${Math.floor(Math.random() * 1001)}),
        ('Messi or Ronaldo: The Eternal Debate', 'FC Bayern', 'Analyzing the impact of these football legends on the sport.', 'https://images.pexels.com/photos/2413089/pexels-photo-2413089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ${topics[2].id}, ${Math.floor(Math.random() * 1001)}),
        ('Hungarian Waterpolo: A Victory at the Olympics', 'Rudi Kapitany', 'How Hungary dominated in waterpolo during the Olympics.', 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ${topics[2].id}, ${Math.floor(Math.random() * 1001)}),
        ('The Future of Cosmetics: Beauty Tech on the Rise', 'Beauty Insider', 'How technology is transforming the beauty industry.', 'https://plugins-media.makeupar.com/smb/blog/post/2021-01-28/3ede8f17-1e11-4770-beff-bb029794f560.jpg', ${topics[3].id}, ${Math.floor(Math.random() * 1001)}),
        ('The Politics of Climate Change', 'Jane Doe', 'A deep dive into how politics is influencing climate change discussions.', 'https://img.freepik.com/free-photo/climate-change-with-dry-soil_23-2149217819.jpg', ${topics[4].id}, ${Math.floor(Math.random() * 1001)}),
        ('The Role of Technology in Space Exploration', 'NASA', 'How modern tech is revolutionizing our missions to Mars and beyond.', 'https://cdn.pixabay.com/photo/2015/02/02/19/31/nasa-621411_640.jpg', ${topics[0].id}, ${Math.floor(Math.random() * 1001)}),
        ('The Rise of E-sports: A New Kind of Sport', 'Esports Pro', 'Exploring the world of competitive gaming and its global impact.', 'https://plus.unsplash.com/premium_photo-1683141331949-64810cfc4ca3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXNwb3J0fGVufDB8fDB8fHww', ${topics[2].id}, ${Math.floor(Math.random() * 1001)}),
        ('Beauty Beyond Skin: The Intersection of Wellness and Beauty', 'Sophia Lee', 'How mental health and wellness are becoming integral to beauty trends.', 'https://img.freepik.com/free-photo/woman-getting-ready-nose-job-surgery_23-2149487569.jpg?semt=ais_hybrid', ${topics[3].id}, ${Math.floor(Math.random() * 1001)}),
        ('Is AI Taking Over Sports? The Future of Automated Coaches', 'Tech Guru', 'How artificial intelligence is influencing sports coaching.', 'https://www.unite.ai/wp-content/uploads/2024/03/Football.webp', ${topics[0].id}, ${Math.floor(Math.random() * 1001)}),
        ('The Power of Political Memes in Todays Society', 'Viral Voter', 'A fun but serious look at how memes influence politics today.', 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?cs=srgb&dl=pexels-tracy-le-blanc-67789-607812.jpg&fm=jpg', ${topics[4].id}, ${Math.floor(Math.random() * 1001)});
    `;
    console.log('Inserted articles with images and random views.');

    // activity log for inserted articles
    console.log('Logging article creation in ActivityLog...');
    const articlesResult = await sql`SELECT id, title FROM articles;`;
    for (const article of articlesResult) {
      await sql`
        INSERT INTO activitylog (type, entity_id, entity_name, action)
        VALUES ('Article Created', ${article.id}, ${article.title}, 'CREATE');
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
