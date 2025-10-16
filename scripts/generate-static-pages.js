import fs from 'fs';
import path from 'path';

// Read the base template
const baseTemplate = fs.readFileSync('dist/public/index.html', 'utf8');

// Define all the pages that need unique canonical URLs
const pages = [
  {
    path: 'shop',
    title: 'Shop - Ikigai Tools & Resources | Ikigain',
    description: 'Shop authentic Ikigai tools, guides, and resources to support your journey of discovering life purpose through Japanese philosophy.',
    keywords: 'ikigai shop, ikigai tools, life purpose resources, Japanese philosophy, ikigai guide, meaning of life'
  },
  {
    path: 'what-is-ikigai',
    title: 'What is Ikigai? Complete Guide to Japanese Life Purpose Philosophy 2025',
    description: 'Discover the meaning of Ikigai, the Japanese philosophy of life purpose. Learn about the 4 pillars, how to find your ikigai, and transform your life with this ancient wisdom.',
    keywords: 'what is ikigai, ikigai meaning, ikigai definition, japanese philosophy, life purpose, 4 pillars of ikigai, finding purpose'
  },
  {
    path: 'ikigai-test',
    title: 'Free Ikigai Test - Discover Your Life Purpose | Ikigain',
    description: 'Take our free ikigai test to discover your life purpose. Based on authentic Japanese philosophy, get personalized insights into your passion, mission, vocation, and profession.',
    keywords: 'free ikigai test, ikigai quiz, life purpose test, ikigai assessment, japanese philosophy test, purpose finder'
  },
  {
    path: 'blog',
    title: 'Ikigai Blog - Life Purpose Articles & Insights | Ikigain',
    description: 'Explore our blog for insights on ikigai, life purpose, and Japanese philosophy. Discover practical tips for finding meaning, purpose, and fulfillment in life.',
    keywords: 'ikigai blog, life purpose articles, japanese philosophy, meaning of life, purpose finder, ikigai insights'
  },
  {
    path: 'ikigai-types/builder',
    title: 'The Builder - Ikigai Personality Type | Ikigain',
    description: 'Discover the Builder ikigai personality type. Learn about their strengths, challenges, career matches, and how to nurture this practical, structure-oriented personality.',
    keywords: 'builder personality, ikigai builder, practical personality, structure oriented, career builder, ikigai type'
  },
  {
    path: 'ikigai-types/explorer',
    title: 'The Explorer - Ikigai Personality Type | Ikigain',
    description: 'Discover the Explorer ikigai personality type. Learn about their adventurous spirit, curiosity, career matches, and how to nurture this discovery-oriented personality.',
    keywords: 'explorer personality, ikigai explorer, adventurous personality, curious mindset, career explorer, ikigai type'
  },
  {
    path: 'ikigai-types/dreamer',
    title: 'The Dreamer - Ikigai Personality Type | Ikigain',
    description: 'Discover the Dreamer ikigai personality type. Learn about their vision, creativity, career matches, and how to nurture this imaginative, future-focused personality.',
    keywords: 'dreamer personality, ikigai dreamer, creative personality, visionary mindset, career dreamer, ikigai type'
  },
  {
    path: 'ikigai-types/achiever',
    title: 'The Achiever - Ikigai Personality Type | Ikigain',
    description: 'Discover the Achiever ikigai personality type. Learn about their drive, determination, career matches, and how to nurture this goal-oriented personality.',
    keywords: 'achiever personality, ikigai achiever, driven personality, goal oriented, career achiever, ikigai type'
  },
  {
    path: 'ikigai-types/helper',
    title: 'The Helper - Ikigai Personality Type | Ikigain',
    description: 'Discover the Helper ikigai personality type. Learn about their empathy, service orientation, career matches, and how to nurture this caring personality.',
    keywords: 'helper personality, ikigai helper, caring personality, service oriented, career helper, ikigai type'
  }
];

// Add positive words pages (A-Z)
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
letters.forEach(letter => {
  pages.push({
    path: `positive-words-that-start-with-${letter}`,
    title: `Positive Words That Start With ${letter.toUpperCase()} - Complete List | Ikigain`,
    description: `Discover positive words that start with ${letter.toUpperCase()}. Explore meaningful words with examples and ikigai connections for personal growth and inspiration.`,
    keywords: `positive words that start with ${letter}, positive ${letter} words, uplifting words, inspirational words`
  });
});

// Generate each page
pages.forEach(page => {
  const canonicalUrl = `https://www.ikigain.org/${page.path}`;
  
  // Replace the SEO metadata in the template
  let pageHtml = baseTemplate
    .replace('<title>Ikigai Test - Discover Your Life Purpose | Ikigain</title>', `<title>${page.title}</title>`)
    .replace('content="Discover your Ikigai with our comprehensive personality test. Find your life purpose through Japanese philosophy and get personalized career insights."', `content="${page.description}"`)
    .replace('content="ikigai, ikigai test, life purpose, ikigai meaning, what is ikigai, personality test, Japanese philosophy, meaning of life, purpose finder"', `content="${page.keywords}"`)
    .replace('<link rel="canonical" href="https://www.ikigain.org/" id="canonical-url">', `<link rel="canonical" href="${canonicalUrl}" id="canonical-url">`)
    .replace('content="Ikigai Test - Discover Your Life Purpose | Ikigain"', `content="${page.title}"`)
    .replace('content="https://www.ikigain.org/"', `content="${canonicalUrl}"`);

  // Create directory if needed
  const filePath = `dist/public/${page.path}.html`;
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(filePath, pageHtml);
  console.log(`✅ Generated: ${filePath} with canonical: ${canonicalUrl}`);
});

console.log(`\n🎉 Generated ${pages.length} static pages with unique canonical URLs!`);