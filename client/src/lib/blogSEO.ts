// Blog SEO optimization utilities

export function generateBlogMetaDescription(title: string, content: string, tags: string[] = []): string {
  // Extract first paragraph or meaningful content
  const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const firstParagraph = cleanContent.split('.')[0] + '.';
  
  // Generate description based on content type
  let description = '';
  
  if (title.toLowerCase().includes('ikigai')) {
    description = `Discover ${title.toLowerCase()} through authentic Japanese wisdom. ${firstParagraph}`;
  } else if (tags.includes('self-discovery')) {
    description = `Explore ${title.toLowerCase()} for personal growth and self-awareness. ${firstParagraph}`;
  } else if (tags.includes('career-guidance')) {
    description = `Professional insights on ${title.toLowerCase()} to advance your career. ${firstParagraph}`;
  } else {
    description = `Learn about ${title.toLowerCase()} and discover practical wisdom for personal development. ${firstParagraph}`;
  }
  
  // Ensure optimal length for SEO (150-160 characters)
  if (description.length > 160) {
    description = description.substring(0, 157) + '...';
  }
  
  return description;
}

export function generateBlogKeywords(title: string, content: string, tags: string[] = []): string[] {
  const baseKeywords = ['ikigai', 'personal development', 'self-discovery', 'life purpose'];
  
  // Extract keywords from title
  const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 3);
  
  // Extract keywords from content
  const contentKeywords = extractKeywordsFromContent(content);
  
  // Combine and deduplicate
  const allKeywords = [...baseKeywords, ...titleWords, ...contentKeywords, ...tags];
  const uniqueKeywords = Array.from(new Set(allKeywords.map(k => k.toLowerCase())));
  
  return uniqueKeywords.slice(0, 10); // Limit to 10 keywords
}

function extractKeywordsFromContent(content: string): string[] {
  const cleanContent = content.replace(/<[^>]*>/g, '').toLowerCase();
  
  // Common Ikigai and personal development terms
  const relevantTerms = [
    'purpose', 'passion', 'mission', 'vocation', 'profession', 'meaning', 'fulfillment',
    'career', 'goals', 'motivation', 'mindfulness', 'growth', 'development', 'success',
    'balance', 'happiness', 'wellness', 'meditation', 'reflection', 'journey'
  ];
  
  return relevantTerms.filter(term => cleanContent.includes(term));
}

export function generateBlogSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const cleanContent = content.replace(/<[^>]*>/g, '');
  const wordCount = cleanContent.split(/\s+/).filter(word => word.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function generateMetaTitle(title: string, category?: string): string {
  const suffix = ' - Ikigai Blog';
  const prefix = category ? `${category}: ` : '';
  const fullTitle = `${prefix}${title}${suffix}`;
  
  // Keep under 60 characters for SEO
  if (fullTitle.length > 60) {
    const truncatedTitle = title.substring(0, 60 - suffix.length - prefix.length - 3) + '...';
    return `${prefix}${truncatedTitle}${suffix}`;
  }
  
  return fullTitle;
}

export function generateOpenGraphTitle(title: string): string {
  // Optimize for social sharing (under 40 characters)
  if (title.length > 40) {
    return title.substring(0, 37) + '...';
  }
  return title;
}

export function generateTwitterDescription(description: string): string {
  // Twitter cards work best with 125-200 characters
  if (description.length > 200) {
    return description.substring(0, 197) + '...';
  }
  return description;
}

export function generateSchemaMarkup(post: any) {
  const baseUrl = 'https://ikigain.org';
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt || post.metaDescription,
    "image": {
      "@type": "ImageObject",
      "url": post.featuredImage ? `${baseUrl}${post.featuredImage}` : `${baseUrl}/images/ikigai-blog-default.jpg`,
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Person",
      "name": post.author || "Ikigain Team",
      "url": `${baseUrl}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ikigain",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/images/logo.png`,
        "width": 400,
        "height": 120
      }
    },
    "datePublished": post.publishedAt || post.createdAt,
    "dateModified": post.updatedAt || post.publishedAt || post.createdAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`
    },
    "url": `${baseUrl}/blog/${post.slug}`,
    "articleSection": "Personal Development",
    "keywords": Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
    "wordCount": post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0,
    "timeRequired": `PT${calculateReadingTime(post.content || '')}M`,
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "genre": "Personal Development",
    "audience": {
      "@type": "Audience",
      "audienceType": "Adults seeking personal growth"
    }
  };
}

export function optimizeBlogForSEO(post: any) {
  const optimizedPost = { ...post };
  
  // Auto-generate meta title if not provided
  if (!optimizedPost.metaTitle) {
    optimizedPost.metaTitle = generateMetaTitle(post.title);
  }
  
  // Auto-generate meta description if not provided
  if (!optimizedPost.metaDescription) {
    optimizedPost.metaDescription = generateBlogMetaDescription(post.title, post.content, post.tags);
  }
  
  // Auto-generate slug if not provided
  if (!optimizedPost.slug) {
    optimizedPost.slug = generateBlogSlug(post.title);
  }
  
  // Calculate reading time
  optimizedPost.readingTime = calculateReadingTime(post.content || '');
  
  // Generate keywords
  const keywords = generateBlogKeywords(post.title, post.content, post.tags);
  optimizedPost.keywords = keywords;
  
  // Generate schema markup
  optimizedPost.schemaMarkup = generateSchemaMarkup(optimizedPost);
  
  return optimizedPost;
}