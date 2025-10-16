import { Helmet } from 'react-helmet-async';

interface SocialMediaOptimizationProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile' | 'video' | 'book';
  author?: string;
  siteName?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

export default function SocialMediaOptimization({
  title,
  description,
  image = '/images/ikigai-social-card.jpg',
  url,
  type = 'website',
  author = 'Ikigain Team',
  siteName = 'Ikigain - Find Your Life Purpose',
  publishedTime,
  modifiedTime,
  tags = [],
  twitterCard = 'summary_large_image'
}: SocialMediaOptimizationProps) {
  const baseUrl = 'https://ikigain.org';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

  // Generate optimized descriptions for different platforms
  const twitterDescription = description.length > 200 ? description.substring(0, 197) + '...' : description;
  const fbDescription = description.length > 300 ? description.substring(0, 297) + '...' : description;

  return (
    <Helmet>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={fbDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Facebook App ID (optional) */}
      <meta property="fb:app_id" content="your-facebook-app-id" />
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          <meta property="article:section" content="Personal Development" />
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@ikigain" />
      <meta name="twitter:creator" content="@ikigain" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* LinkedIn specific */}
      <meta property="og:image:type" content="image/jpeg" />
      <meta name="linkedin:owner" content="company-id" />
      
      {/* Pinterest */}
      <meta name="pinterest:title" content={title} />
      <meta name="pinterest:description" content={description} />
      <meta name="pinterest:image" content={fullImage} />
      
      {/* WhatsApp */}
      <meta property="og:image:secure_url" content={fullImage} />
      
      {/* Telegram */}
      <meta name="telegram:channel" content="@ikigain" />
      
      {/* Discord */}
      <meta name="theme-color" content="#3B82F6" />
      
      {/* Rich Results for Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'BlogPosting' : 'WebPage',
          "headline": title,
          "description": description,
          "image": {
            "@type": "ImageObject",
            "url": fullImage,
            "width": 1200,
            "height": 630
          },
          "author": {
            "@type": "Person",
            "name": author
          },
          "publisher": {
            "@type": "Organization",
            "name": siteName,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/images/logo.png`
            }
          },
          "datePublished": publishedTime,
          "dateModified": modifiedTime || publishedTime,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
          },
          "url": fullUrl,
          "potentialAction": {
            "@type": "ReadAction",
            "target": fullUrl
          }
        })}
      </script>
    </Helmet>
  );
}

// Helper function to generate dynamic social media cards
export function generateSocialCard(title: string, description: string, type: 'blog' | 'test' | 'type' | 'general' = 'general') {
  // const baseUrl = 'https://ikigain.org';
  
  // Generate different card designs based on content type
  const cardImages = {
    blog: '/images/social-cards/blog-card.jpg',
    test: '/images/social-cards/test-card.jpg',
    type: '/images/social-cards/type-card.jpg',
    general: '/images/social-cards/general-card.jpg'
  };
  
  return {
    image: cardImages[type],
    title: title.length > 60 ? title.substring(0, 57) + '...' : title,
    description: description.length > 155 ? description.substring(0, 152) + '...' : description
  };
}

// Auto-generate meta descriptions optimized for social sharing
export function generateSocialDescription(content: string, type: 'blog' | 'test' | 'type' | 'general' = 'general') {
  const baseDescriptions = {
    blog: 'Discover insights on finding your life purpose through Ikigai. Learn practical wisdom from Japanese philosophy and modern psychology.',
    test: 'Take our free Ikigai test to discover your life purpose. Find the intersection of what you love, what you\'re good at, what the world needs, and what you can be paid for.',
    type: 'Learn about the Ikigai personality types and discover how each finds their unique path to purpose and fulfillment.',
    general: 'Discover your life\'s purpose through Ikigai - the Japanese concept of finding meaning at the intersection of passion, mission, vocation, and profession.'
  };
  
  // Extract key phrases from content
  const keyPhrases = extractKeyPhrases(content);
  const baseDesc = baseDescriptions[type];
  
  // Combine with extracted content for more specific description
  if (keyPhrases.length > 0) {
    return `${baseDesc} ${keyPhrases.slice(0, 2).join(', ')}.`;
  }
  
  return baseDesc;
}

// Extract key phrases from content for better meta descriptions
function extractKeyPhrases(content: string): string[] {
  const phrases = [];
  const words = content.toLowerCase().split(/\s+/);
  
  // Look for Ikigai-related terms
  const ikigaiTerms = ['purpose', 'passion', 'mission', 'vocation', 'profession', 'meaning', 'fulfillment', 'career', 'life'];
  
  for (const term of ikigaiTerms) {
    if (words.includes(term)) {
      phrases.push(term);
    }
  }
  
  return phrases;
}