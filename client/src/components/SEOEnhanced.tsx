import { Helmet } from 'react-helmet-async';

interface SEOEnhancedProps {
  title: string;
  description: string | null;
  keywords?: string[];
  author?: string;
  publishedTime: string;
  modifiedTime?: string;
  image: string | null;
  url?: string;
  type?: 'website' | 'article' | 'blog';
  tags?: string[];
  readingTime: number | null;
  category?: string;
  noindex?: boolean;
}

export default function SEOEnhanced({
  title,
  description,
  keywords = [],
  author = 'Ikigain Team',
  publishedTime,
  modifiedTime,
  image = '/images/ikigai-og-image.jpg',
  url,
  type = 'website',
  tags = [],
  readingTime,
  category,
  noindex = false
}: SEOEnhancedProps) {
  const siteName = 'Ikigain - Find Your Life Purpose';
  const siteUrl = 'https://ikigain.org';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image && image.startsWith('http') ? image : `${siteUrl}${image || '/images/ikigai-og-image.jpg'}`;

  // Auto-generate enhanced meta description if not provided
  const enhancedDescription = description || generateMetaDescription(title, category, tags, readingTime ?? undefined);

  // Generate schema markup
  const schemaData = generateSchemaMarkup({
    title,
    description: enhancedDescription,
    author,
    publishedTime,
    modifiedTime,
    image: fullImage,
    url: fullUrl,
    type,
    tags,
    readingTime,
    category
  });

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={enhancedDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Robots Meta */}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={enhancedDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={enhancedDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@ikigain" />
      <meta name="twitter:creator" content="@ikigain" />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {category && <meta property="article:section" content={category} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Mobile App Meta */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Ikigain" />
      
      {/* Performance & Loading */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#3b82f6" />
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
}

// Auto-generate meta descriptions based on content
function generateMetaDescription(title: string, category?: string, tags: string[] = [], readingTime?: number): string {
  const baseDescription = "Discover your life's purpose through Ikigai";
  const categoryText = category ? ` in ${category}` : '';
  const tagsText = tags.length > 0 ? ` about ${tags.slice(0, 3).join(', ')}` : '';
  const readingText = readingTime ? ` (${readingTime} min read)` : '';
  
  if (title.toLowerCase().includes('ikigai')) {
    return `${title}${categoryText}${tagsText}. ${baseDescription} - the Japanese concept of finding meaning and fulfillment${readingText}.`;
  }
  
  return `${title}${categoryText}${tagsText}. Learn about personal development, self-discovery, and finding your purpose through Ikigai${readingText}.`;
}

// Generate comprehensive schema markup
function generateSchemaMarkup({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  image,
  url,
  type,
  tags,
  readingTime,
  category
}: {
  title: string;
  description: string;
  author: string;
  publishedTime?: string;
  modifiedTime?: string;
  image: string;
  url: string;
  type: string;
  tags: string[];
  readingTime: number | null;
  category?: string;
}) {
  if (type === 'article') {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": description,
      "image": {
        "@type": "ImageObject",
        "url": image,
        "width": 1200,
        "height": 630
      },
      "author": {
        "@type": "Person",
        "name": author,
        "url": "https://ikigain.org/about"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Ikigain",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ikigain.org/images/logo.png",
          "width": 400,
          "height": 120
        }
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "articleSection": category,
      "keywords": tags.join(', '),
      "wordCount": readingTime ? readingTime * 200 : undefined,
      "timeRequired": readingTime ? `PT${readingTime}M` : undefined,
      "inLanguage": "en-US",
      "isAccessibleForFree": true
    };
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "image": image,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": "Ikigain",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ikigain.org/images/logo.png",
        "width": 400,
        "height": 120
      }
    },
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Ikigain - Find Your Life Purpose",
      "url": "https://ikigain.org"
    }
  };
}