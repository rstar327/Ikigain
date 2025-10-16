import { storage } from "./storage";

export async function generateSitemap(): Promise<string> {
  // Always use the www custom domain for production sitemap
  const baseUrl = 'https://www.ikigain.org';

  // Enhanced static pages with better SEO priorities (English)
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' }, // Home
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/what-is-ikigai', priority: '0.9', changefreq: 'monthly' },
    { url: '/ikigai-personality-types', priority: '0.9', changefreq: 'monthly' },
    { url: '/ikigai-type-test', priority: '0.9', changefreq: 'weekly' },
    { url: '/ikigai-test', priority: '0.9', changefreq: 'weekly' },
    { url: '/shop', priority: '0.7', changefreq: 'weekly' },
    { url: '/blog', priority: '0.8', changefreq: 'daily' },
    { url: '/positive-words', priority: '0.8', changefreq: 'weekly' },
    { url: '/ikigai-word-wheel', priority: '0.8', changefreq: 'weekly' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    // Enhanced SEO URLs
    { url: '/home', priority: '0.9', changefreq: 'weekly' },
    { url: '/full-ikigai-test', priority: '0.9', changefreq: 'weekly' },
    { url: '/free-ikigai-test', priority: '0.8', changefreq: 'weekly' },
    { url: '/premium-features', priority: '0.6', changefreq: 'monthly' },
    { url: '/upgrade', priority: '0.5', changefreq: 'monthly' },
  ];



  // Spanish version pages (duplicate structure with /es/ prefix)
  const spanishPages = staticPages.map(page => ({
    url: `/es${page.url}`,
    priority: page.priority,
    changefreq: page.changefreq
  }));

  // French version pages (duplicate structure with /fr/ prefix)
  const frenchPages = staticPages.map(page => ({
    url: `/fr${page.url}`,
    priority: page.priority,
    changefreq: page.changefreq
  }));

  // Individual personality type pages (Quick Type Test)
  const quickTypePersonalities = [
    'builder', 'explorer', 'dreamer', 'achiever', 'helper'
  ];

  // Main Ikigai Test personality types
  const mainTestPersonalities = [
    'creative-enthusiast', 'skilled-expert', 'purpose-driven-leader', 'career-focused-achiever'
  ];

  // English Quick Type Test personality pages
  const quickTypePages = quickTypePersonalities.map(type => ({
    url: `/ikigai-types/${type}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));

  // English Main Test personality pages
  const mainTestPages = mainTestPersonalities.map(type => ({
    url: `/ikigai-types/${type}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));

  // Spanish Quick Type Test personality pages
  const spanishQuickTypePages = quickTypePersonalities.map(type => ({
    url: `/es/ikigai-types/${type}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));

  // Spanish Main Test personality pages
  const spanishMainTestPages = mainTestPersonalities.map(type => ({
    url: `/es/ikigai-types/${type}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));

  // French Quick Type Test personality pages
  const frenchQuickTypePages = quickTypePersonalities.map(type => ({
    url: `/fr/ikigai-types/${type}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));

  // French Main Test personality pages
  const frenchMainTestPages = mainTestPersonalities.map(type => ({
    url: `/fr/ikigai-types/${type}`,
    priority: '0.8',
    changefreq: 'monthly'
  }));

  // Blog posts with enhanced priority calculation
  let blogPages: any[] = [];
  try {
    const blogPosts = await storage.getPublishedBlogPosts();
    blogPages = blogPosts.map(post => ({
      url: `/blog/${post.slug}`,
      priority: calculateBlogPriority(post),
      changefreq: 'weekly',
      lastmod: post.updatedAt,
      featuredImage: post.featuredImage
    }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Blog category pages
  const blogCategories = [
    'self-discovery', 'career-guidance', 'life-balance', 'motivation', 'mindfulness'
  ];

  const categoryPages = blogCategories.map(category => ({
    url: `/blog/category/${category}`,
    priority: '0.6',
    changefreq: 'weekly'
  }));

  // Positive words letter pages
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const positiveWordsPages = alphabet.map(letter => ({
    url: `/positive-words-that-start-with-${letter}`,
    priority: '0.7',
    changefreq: 'weekly'
  }));

  // Spanish positive words pages
  const spanishPositiveWordsPages = alphabet.map(letter => ({
    url: `/es/positive-words-that-start-with-${letter}`,
    priority: '0.7',
    changefreq: 'weekly'
  }));

  // French positive words pages
  const frenchPositiveWordsPages = alphabet.map(letter => ({
    url: `/fr/positive-words-that-start-with-${letter}`,
    priority: '0.7',
    changefreq: 'weekly'
  }));

  // Combine all pages (English + Spanish + French)
  const allPages = [
    ...staticPages, 
    ...spanishPages,
    ...frenchPages,
    ...quickTypePages,
    ...mainTestPages,
    ...spanishQuickTypePages, 
    ...spanishMainTestPages,
    ...frenchQuickTypePages,
    ...frenchMainTestPages,
    ...blogPages, 
    ...categoryPages,
    ...positiveWordsPages,
    ...spanishPositiveWordsPages,
    ...frenchPositiveWordsPages
  ];

  // Generate enhanced XML with image sitemap support
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => generateUrlXML(page, baseUrl)).join('\n')}
</urlset>`;

  return sitemap;
}

// Calculate blog post priority based on recency and engagement
function calculateBlogPriority(post: any): string {
  const now = new Date();
  const postDate = new Date(post.createdAt);
  const daysSincePost = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Higher priority for newer posts
  if (daysSincePost < 7) return '0.9';
  if (daysSincePost < 30) return '0.8';
  if (daysSincePost < 90) return '0.7';
  return '0.6';
}

// Generate enhanced URL XML with image support
function generateUrlXML(page: any, baseUrl: string): string {
  const isBlogPost = page.url.startsWith('/blog/') && !page.url.includes('/category/');
  
  let xml = `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
${page.lastmod ? `    <lastmod>${new Date(page.lastmod).toISOString()}</lastmod>` : ''}`;

  // Add image information for blog posts
  if (isBlogPost && page.featuredImage) {
    xml += `
    <image:image>
      <image:loc>${baseUrl}${page.featuredImage}</image:loc>
      <image:caption>Ikigai blog post featured image</image:caption>
    </image:image>`;
  }

  xml += `
  </url>`;

  return xml;
}

// Generate RSS feed for blog posts
export async function generateRSSFeed(): Promise<string> {
  const baseUrl = process.env.REPLIT_DOMAINS 
    ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
    : 'https://www.ikigain.org';
  
  let blogPosts: any[] = [];
  try {
    blogPosts = await storage.getPublishedBlogPosts();
    blogPosts = blogPosts.slice(0, 20); // Limit to 20 recent posts
  } catch (error) {
    console.error('Error fetching blog posts for RSS:', error);
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ikigain Blog - Find Your Life Purpose</title>
    <description>Discover your life's purpose through Ikigai - insights, guides, and inspiration for personal development and self-discovery.</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <managingEditor>hello@ikigain.org (Ikigain Team)</managingEditor>
    <webMaster>hello@ikigain.org (Ikigain Team)</webMaster>
    <category>Personal Development</category>
    <category>Self Discovery</category>
    <category>Life Purpose</category>
    <image>
      <url>${baseUrl}/images/logo.png</url>
      <title>Ikigain Blog</title>
      <link>${baseUrl}/blog</link>
    </image>
${blogPosts.map(post => `    <item>
      <title>${escapeXML(post.title)}</title>
      <description>${escapeXML(post.excerpt || '')}</description>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <author>hello@ikigain.org (Ikigain Team)</author>
      ${post.tags ? post.tags.map((tag: string) => `<category>${escapeXML(tag)}</category>`).join('\n      ') : ''}
    </item>`).join('\n')}
  </channel>
</rss>`;

  return rss;
}

// Helper function to escape XML characters
function escapeXML(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}