import sql from '../configs/dbconfig';

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    console.log('Clearing old data...');
    await sql`TRUNCATE TABLE articles RESTART IDENTITY CASCADE;`;
    await sql`TRUNCATE TABLE topics RESTART IDENTITY CASCADE;`;
    console.log('Old data cleared.');

    // Insert topics
    console.log('Inserting topics...');
    const topics = await sql`
      INSERT INTO topics (title)
      VALUES 
        ('Technology'),
        ('Science'),
        ('Sport'),
        ('Beauty'),
        ('Politics')
      RETURNING *;
    `;
    console.log('Inserted topics:', topics);

   
    console.log('Inserting articles...');
    await sql`
      INSERT INTO articles (title, author, text, image, topic_id)
      VALUES 
        ('Talking Robots: AI in Futurama', 'Bender the robot', 'Exploring the latest in AI, as seen in Futurama.', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ${topics[0].id}),
        ('Moonlanding vs UFOs: What NASA Knows', 'NASA', 'Mars missions update with some thoughts on UFO encounters.', 'https://images.pexels.com/photos/8474990/pexels-photo-8474990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ${topics[1].id}),
        ('What is Modern Art? A Digital Revolution', 'Monet', 'Exploring the rise of digital art and how technology is changing creativity.', 'https://images.pexels.com/photos/5033989/pexels-photo-5033989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ${topics[4].id}),
        ('Messi or Ronaldo: The Eternal Debate', 'FC Bayern', 'Analyzing the impact of these football legends on the sport.', 'https://images.pexels.com/photos/2413089/pexels-photo-2413089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ${topics[2].id}),
        ('Hungarian Waterpolo: A Victory at the Olympics', 'Rudi Kapitany', 'How Hungary dominated in waterpolo during the Olympics.', 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ${topics[2].id}),
        ('The Future of Cosmetics: Beauty Tech on the Rise', 'Beauty Insider', 'How technology is transforming the beauty industry.', 'https://plugins-media.makeupar.com/smb/blog/post/2021-01-28/3ede8f17-1e11-4770-beff-bb029794f560.jpg', ${topics[3].id}),
        ('The Politics of Climate Change', 'Jane Doe', 'A deep dive into how politics is influencing climate change discussions.', 'https://img.freepik.com/free-photo/climate-change-with-dry-soil_23-2149217819.jpg', ${topics[4].id}),
        ('The Role of Technology in Space Exploration', 'NASA', 'How modern tech is revolutionizing our missions to Mars and beyond.', 'https://cdn.pixabay.com/photo/2015/02/02/19/31/nasa-621411_640.jpg', ${topics[0].id}),
        ('The Rise of E-sports: A New Kind of Sport', 'Esports Pro', 'Exploring the world of competitive gaming and its global impact.', 'https://plus.unsplash.com/premium_photo-1683141331949-64810cfc4ca3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZXNwb3J0fGVufDB8fDB8fHww', ${topics[2].id}),
        ('Beauty Beyond Skin: The Intersection of Wellness and Beauty', 'Sophia Lee', 'How mental health and wellness are becoming integral to beauty trends.', 'https://img.freepik.com/free-photo/woman-getting-ready-nose-job-surgery_23-2149487569.jpg?semt=ais_hybrid', ${topics[3].id}),
        ('Is AI Taking Over Sports? The Future of Automated Coaches', 'Tech Guru', 'How artificial intelligence is influencing sports coaching.', 'https://www.unite.ai/wp-content/uploads/2024/03/Football.webp', ${topics[0].id}),
        ('The Power of Political Memes in Today’s Society', 'Viral Voter', 'A fun but serious look at how memes influence politics today.', 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?cs=srgb&dl=pexels-tracy-le-blanc-67789-607812.jpg&fm=jpg', ${topics[4].id});
    `;
    console.log('Inserted articles with images.');

    console.log('Database seeding completed successfully.');
    process.exit(0); // Exit with success
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); // Exit with failure
  }
};

seedDatabase();
