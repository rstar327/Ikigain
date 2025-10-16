import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@shared/schema";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useState, useMemo } from "react";
import { X, Menu } from 'lucide-react';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog/posts', slug],
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Configure marked for better formatting
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  const renderContent = useMemo(() => {
    if (!post?.content) return '';
    const rawMarkdown = marked(post.content) as string;
    return DOMPurify.sanitize(rawMarkdown);
  }, [post?.content]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt || ''}
        keywords={post.tags?.join(', ') || ''}
        canonical={`/blog/${post.slug}`}
        ogTitle={post.title}
        ogDescription={post.excerpt || ''}
        ogImage={post.featuredImage || ''}
        ogType="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "datePublished": post.publishedAt,
          "dateModified": post.updatedAt,
          "author": {
            "@type": "Person",
            "name": "Ikigai Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Ikigai",
            "url": window.location.origin
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
          },
          "image": post.featuredImage
        }}
      />

      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                Ikigai
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link href="/blog" className="text-blue-600 font-medium">
                  Blog
                </Link>
                <Link href="/test" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Take Test
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/blog">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="sm">
                    Home
                  </Button>
                </Link>
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                  Home
                </Link>
                <Link href="/blog" className="block px-3 py-2 text-blue-600 font-medium">
                  Blog
                </Link>
                <Link href="/test" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                  Take Test
                </Link>
                <hr className="my-2" />
                <Link href="/blog" className="block px-3 py-2 text-blue-600 hover:text-blue-700">
                  ← Back to Blog
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">


        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.publishedAt && format(new Date(post.publishedAt), 'MMMM d, yyyy')}
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} min read
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg prose-blue max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-blockquote:text-gray-700 prose-blockquote:border-blue-500"
          dangerouslySetInnerHTML={{ __html: renderContent }}
        />

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Discover Your Ikigai?
            </h3>
            <p className="text-gray-600 mb-6">
              Take our comprehensive assessment to uncover your unique purpose and find your path to fulfillment.
            </p>
            <Link href="/test">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Your Ikigai Test
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}