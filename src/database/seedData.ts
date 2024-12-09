import sql from "../configs/dbconfig";

const seedDatabase = async () => {
  try {
    console.log('Clearing old data...');
    
    // Clear 
    await sql`DELETE FROM articles;`;
    await sql`DELETE FROM topics;`;

    // Reset 
    console.log('Resetting articles sequence...');
    await sql`ALTER SEQUENCE articles_id_seq RESTART WITH 1;`; 

    console.log('Inserting topics...');
    const topics = await sql`
      INSERT INTO topics (title)
      VALUES ('Techn'), ('Science'), ('Sport'), ('Beauty'), ('Politics')
      RETURNING *;
    `;
    console.log('Inserted topics:', topics);

    console.log('Inserting articles...');
    await sql`
      INSERT INTO articles (title, author, text, topic_id)
      VALUES 
        ('Talking Robots: AI in Futurama', 'Bender the robot', 'Exploring the latest in AI, as seen in Futurama.', ${topics[0].id}),
        ('Moonlanding vs UFOs: What NASA Knows', 'NASA', 'Mars missions update with some thoughts on UFO encounters.', ${topics[1].id}),
        ('What is Modern Art? A Digital Revolution', 'Monet', 'Exploring the rise of digital art and how technology is changing creativity.', ${topics[4].id}),
        ('Messi or Ronaldo: The Eternal Debate', 'FC Bayern', 'Analyzing the impact of these football legends on the sport.', ${topics[2].id}),
        ('Hungarian Waterpolo: A Victory at the Olympics', 'Rudi Kapitany', 'How Hungary dominated in waterpolo during the Olympics.', ${topics[2].id}),
        ('The Future of Cosmetics: Beauty Tech on the Rise', 'Beauty Insider', 'How technology is transforming the beauty industry.', ${topics[3].id}),
        ('The Politics of Climate Change', 'Jane Doe', 'A deep dive into how politics is influencing climate change discussions.', ${topics[4].id}),
        ('The Role of Technology in Space Exploration', 'NASA', 'How modern tech is revolutionizing our missions to Mars and beyond.', ${topics[0].id}),
        ('The Rise of Esports: A New Kind of Sport', 'Esports Pro', 'Exploring the world of competitive gaming and its global impact.', ${topics[2].id}),
        ('Beauty Beyond Skin: The Intersection of Wellness and Beauty', 'Sophia Lee', 'How mental health and wellness are becoming integral to beauty trends.', ${topics[3].id}),
        ('Is AI Taking Over Sports? The Future of Automated Coaches', 'Tech Guru', 'How artificial intelligence is influencing sports coaching.', ${topics[0].id}),
        ('The Power of Political Memes in Today’s Society', 'Viral Voter', 'A fun but serious look at how memes influence politics today.', ${topics[4].id});
    `;
    console.log('Inserted articles.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
