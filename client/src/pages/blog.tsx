import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight, X, Menu, User } from "lucide-react";
import { format } from "date-fns";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

export default function Blog() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blog</h2>
          <p className="text-gray-600">Unable to load blog posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Ikigai Blog - Insights on Living with Purpose"
        description="Explore authentic insights on ikigai, purpose, and meaningful living. Discover practical wisdom from Japanese philosophy and modern psychology."
        keywords="ikigai blog, purpose, meaningful life, japanese philosophy, self-discovery, career guidance"
        canonical="/blog"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Ikigai Blog",
          "description": "Insights on living with purpose through ikigai philosophy",
          "url": `${window.location.origin}/blog`,
          "blogPost": posts?.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "datePublished": post.publishedAt,
            "dateModified": post.updatedAt,
            "url": `${window.location.origin}/blog/${post.slug}`,
            "author": {
              "@type": "Person",
              "name": "Ikigai Team"
            }
          }))
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
                <Link href="/">
                  <Button variant="outline" size="sm">
                    Home
                  </Button>
                </Link>
                <Link href="/test">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Take Test
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
                <Link href="/test" className="block px-3 py-2 bg-blue-600 text-white rounded-md">
                  Take Test
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Ikigai Blog
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Discover insights on living with purpose, balance, and joy through authentic Japanese philosophy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                    <CardHeader className="p-0">
                      {post.featuredImage && (
                        <div className="w-full h-48 overflow-hidden rounded-t-lg">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.publishedAt && format(new Date(post.publishedAt), 'MMM d, yyyy')}
                        </div>
                        {post.readingTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readingTime} min read
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="p-6 pt-0">
                      <Link href={`/blog/${post.slug}`} className="w-full">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </motion.button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blog Posts Yet</h3>
              <p className="text-gray-600">
                We're working on bringing you inspiring content about ikigai and purposeful living.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}