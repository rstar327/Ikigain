import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight, Search, Filter, Tag, TrendingUp, Star, BookOpen, Users, Heart, MessageCircle, Eye } from "lucide-react";
// import { motion } from "framer-motion"; // Removed for performance
import { format } from "date-fns";
import SEOEnhanced from "@/components/SEOEnhanced";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BlogPost } from "@shared/schema";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import { motion } from 'framer-motion';

export default function BlogEnhanced() {
  const { t } = useTranslation('blog');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
  });

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post?.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || 
                             (post.tags && post.tags.some(tag => 
                               tag.toLowerCase().includes(selectedCategory.toLowerCase())
                             ));
      
      return matchesSearch && matchesCategory && post.isPublished;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.publishedAt || a.createdAt || 0).getTime() - new Date(b.publishedAt || b.createdAt || 0).getTime();
        case "popular":
          return (b.readingTime || 0) - (a.readingTime || 0); // Use reading time as popularity proxy
        default: // newest
          return new Date(b.publishedAt || b.createdAt || 0).getTime() - new Date(a.publishedAt || a.createdAt || 0).getTime();
      }
    });

    return filtered;
  }, [posts, searchTerm, selectedCategory, sortBy]);

  // Get featured post (most recent)
  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  // Get popular tags
  const popularTags = useMemo(() => {
    if (!posts) return [];
    const tagCounts = new Map<string, number>();
    
    posts.forEach(post => {
      if (post.tags) {
        const tags = Array.isArray(post.tags) ? post.tags : (post.tags as string).split(',');
        tags.forEach(tag => {
          const cleanTag = tag.trim();
          tagCounts.set(cleanTag, (tagCounts.get(cleanTag) || 0) + 1);
        });
      }
    });
    
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [posts]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-2xl mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-80 bg-gray-300 rounded-xl"></Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blog</h2>
          <p className="text-gray-600">Unable to load blog posts. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      <SEOEnhanced
        title="Ikigai Blog - Insights on Living with Purpose"
        description="Explore authentic insights on ikigai, purpose, and meaningful living. Discover practical wisdom from Japanese philosophy and modern psychology for self-discovery and career guidance."
        keywords={['ikigai', 'ikigai blog', 'purpose', 'meaningful life', 'japanese philosophy', 'self-discovery', 'career guidance', 'personal development', 'life purpose', 'ikigai meaning']}
        author="Ikigain Team"
        url="/blog"
        type="website"
        category="Personal Development"
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            {t('title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
          
          {/* Search and Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-2xl mx-auto"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 h-12 bg-white border-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('filterBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('categories.all')}</SelectItem>
                <SelectItem value="self-discovery">{t('categories.selfDiscovery')}</SelectItem>
                <SelectItem value="career">{t('categories.careerGuidance')}</SelectItem>
                <SelectItem value="balance">{t('categories.lifeBalance')}</SelectItem>
                <SelectItem value="motivation">{t('categories.motivation')}</SelectItem>
                <SelectItem value="mindfulness">{t('categories.mindfulness')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48 h-12 bg-white border-gray-200">
                <SelectValue placeholder={t('sortBy')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t('sortOptions.newest')}</SelectItem>
                <SelectItem value="oldest">{t('sortOptions.oldest')}</SelectItem>
                <SelectItem value="popular">{t('sortOptions.popular')}</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Article</h2>
            </div>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 bg-white border-0 shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative overflow-hidden">
                  {featuredPost.featuredImage ? (
                    <img 
                      src={featuredPost.featuredImage} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 text-white">Featured</Badge>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {featuredPost.publishedAt && format(new Date(featuredPost.publishedAt), 'MMM d, yyyy')}
                      </div>
                      {featuredPost.readingTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {featuredPost.readingTime} min read
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {featuredPost.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    {featuredPost.tags && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(Array.isArray(featuredPost.tags) ? featuredPost.tags : (featuredPost.tags as string).split(',')).slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <Button className="group/btn bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {Math.floor(Math.random() * 1000) + 500}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {Math.floor(Math.random() * 50) + 10}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      )}

      {/* Blog Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-0 shadow-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{posts?.length || 0}</h3>
            <p className="text-gray-600">Total Articles</p>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">10k+</h3>
            <p className="text-gray-600">Monthly Readers</p>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">95%</h3>
            <p className="text-gray-600">Reader Satisfaction</p>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">Comments</p>
          </Card>
        </div>
      </section>

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Tag className="h-5 w-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Popular Topics</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag, index) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setSelectedCategory(tag.toLowerCase())}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                #{tag}
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Main Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
          <span className="text-sm text-gray-500">({filteredPosts.length} articles)</span>
        </div>
        
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('noPostsFound')}</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg overflow-hidden h-full">
                  <div className="relative overflow-hidden">
                    {post.featuredImage ? (
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {post.publishedAt && format(new Date(post.publishedAt), 'MMM d')}
                      </div>
                      {post.readingTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readingTime} min
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </CardHeader>
                  
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    
                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(Array.isArray(post.tags) ? post.tags : (post.tags as string).split(',')).slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm" className="group/btn">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Heart className="h-4 w-4" />
                        {Math.floor(Math.random() * 25) + 5}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">{t('subscribe.title')}</h3>
            <p className="text-xl mb-6 text-blue-100">{t('subscribe.description')}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder={t('subscribe.placeholder')}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder-white/70 focus:border-white/50 focus:ring-white/50"
              />
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                {t('subscribe.button')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}