import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Heart, MessageCircle, BookOpen, Eye, Facebook, Twitter, Linkedin, Copy, Sun, Moon, Minus, Plus, Printer, Settings } from "lucide-react";
// import { motion } from "framer-motion"; // Removed for performance
import { format } from "date-fns";
import SEOEnhanced from "@/components/SEOEnhanced";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@shared/schema";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import BlogComments from "@/components/BlogComments";
import Navigation from "@/components/Navigation";

export default function BlogPostEnhanced() {
  const { t } = useTranslation('blog');
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);
  const [liked, setLiked] = useState(false);
  
  // Reading experience state
  const [readingProgress, setReadingProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showReadingControls, setShowReadingControls] = useState(false);
  
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog/posts', slug],
    enabled: !!slug,
  });

  const { data: allPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
  });

  // Configure marked for better formatting
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Font size controls
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(24, prev + 2));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(12, prev - 2));
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  const renderContent = async (content: string) => {
    const rawMarkdown = await marked(content);
    return DOMPurify.sanitize(rawMarkdown);
  };

  // Get related articles based on tags
  const relatedPosts = useMemo(() => {
    if (!post || !allPosts) return [];
    
    const currentTags = Array.isArray(post.tags) ? post.tags : ((post.tags as any)?.split(',') || []);
    
    const related = allPosts
      .filter(p => p.id !== post.id && p.isPublished)
      .map(p => {
        const postTags = Array.isArray(p.tags) ? p.tags : ((p.tags as any)?.split(',') || []);
        const commonTags = currentTags.filter((tag: any) => 
          postTags.some((pTag: any) => pTag.toLowerCase().includes(tag.toLowerCase()))
        );
        return { post: p, similarity: commonTags.length };
      })
      .filter(item => item.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map(item => item.post);
    
    return related;
  }, [post, allPosts]);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "The article link has been copied to your clipboard.",
        });
      } catch {
        toast({
          title: "Error",
          description: "Failed to copy link.",
          variant: "destructive",
        });
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
    setShowShareMenu(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToBlog')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = post.readingTime || Math.ceil(post.content.split(' ').length / 250);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
      
      <Navigation />
      
      {/* Reading Controls - Fixed Position */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 print-hidden">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReadingControls(!showReadingControls)}
            className="w-full"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          {showReadingControls && (
            <div className="space-y-2">
              {/* Font Size Controls */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 12}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-xs px-2">{fontSize}px</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={fontSize >= 24}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              {/* Print Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrint}
                className="w-full"
              >
                <Printer className="h-4 w-4" />
              </Button>
              
              {/* Reading Progress Display */}
              <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                {Math.round(readingProgress)}%
              </div>
            </div>
          )}
        </div>
      </div>
      
      <SEOEnhanced
        title={post.metaTitle || `${post.title} - Ikigai Blog`}
        description={post.metaDescription || post.excerpt}
        keywords={Array.isArray(post.tags) ? post.tags : (post.tags ? (post.tags as string).split(',') : [])}
        author={post.author || "Ikigain Team"}
        publishedTime={String(post.publishedAt || post.createdAt)}
        modifiedTime={String(post.updatedAt)}
        image={post.featuredImage}
        url={`/blog/${post.slug}`}
        type="article"
        tags={Array.isArray(post.tags) ? post.tags : (post.tags ? (post.tags as string).split(',') : [])}
        readingTime={post.readingTime}
        category="Personal Development"
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <Link href="/blog">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('backToBlog')}
                </Button>
              </Link>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {post.publishedAt && format(new Date(post.publishedAt), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {Math.floor(Math.random() * 1000) + 500} views
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        </section>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-none">
          {/* Main Content */}
          <div>
            <div className={`rounded-2xl shadow-lg p-8 mb-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
              <div 
                className={`prose prose-lg max-w-none transition-all duration-300 ${isDarkMode ? 'prose-invert' : 'prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-pre:bg-gray-50 prose-blockquote:border-blue-500 prose-blockquote:text-gray-700'}`}
                style={{ fontSize: `${fontSize}px` }}
                dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
              />
            </div>

            {/* Engagement Actions */}
            <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors duration-300 print-hidden ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant={liked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    className={`flex items-center gap-2 ${liked ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  >
                    <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                    {likes}
                  </Button>
                  
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Comment
                  </Button>
                </div>
                
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    {t('sharePost')}
                  </Button>
                  
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-2">
                        <button
                          onClick={() => handleShare('facebook')}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md"
                        >
                          <Facebook className="h-4 w-4 text-blue-600" />
                          Facebook
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md"
                        >
                          <Twitter className="h-4 w-4 text-blue-400" />
                          Twitter
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md"
                        >
                          <Linkedin className="h-4 w-4 text-blue-700" />
                          LinkedIn
                        </button>
                        <button
                          onClick={() => handleShare('copy')}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md"
                        >
                          <Copy className="h-4 w-4 text-gray-600" />
                          Copy Link
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{t('relatedPosts')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <div key={relatedPost.id}>
                <Card className="group hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg overflow-hidden h-full">
                  <div className="relative overflow-hidden">
                    {relatedPost.featuredImage ? (
                      <img 
                        src={relatedPost.featuredImage} 
                        alt={relatedPost.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {relatedPost.publishedAt && format(new Date(relatedPost.publishedAt), 'MMM d')}
                      </div>
                      {relatedPost.readingTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {relatedPost.readingTime} min
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-3">
                      {relatedPost.title}
                    </h3>
                    
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {relatedPost.excerpt}
                    </p>
                    
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <Button variant="outline" size="sm" className="w-full group/btn">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comments Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <BlogComments postSlug={post.slug} />
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-blue-100 mb-6">Get the latest insights on Ikigai and personal development delivered to your inbox.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:border-white/50"
              />
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}