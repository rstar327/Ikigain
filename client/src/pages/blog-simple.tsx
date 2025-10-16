import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, Clock, ArrowRight, Search, BookOpen, Home } from "lucide-react";
import { format } from "date-fns";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BlogPost } from "@shared/schema";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";

export default function BlogSimple() {
  const { t } = useTranslation('blog');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    let filtered = posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
      
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
          return (b.readingTime || 0) - (a.readingTime || 0);
        default: // newest
          return new Date(b.publishedAt || b.createdAt || 0).getTime() - new Date(a.publishedAt || a.createdAt || 0).getTime();
      }
    });

    return filtered;
  }, [posts, searchTerm, selectedCategory, sortBy]);

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading blog posts</h2>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <SEO
        title="Ikigai Blog - Insights and Guides for Finding Your Purpose"
        description="Discover insights and practical guides about Ikigai, finding life's purpose, career development, and personal growth."
        keywords="ikigai, life purpose, career development, personal growth, self-discovery"
      />
      
      <Navigation />
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('subtitle')}
          </p>
          
          {/* Search and Filter */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('filterBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('categories.all')}</SelectItem>
                  <SelectItem value="self-discovery">{t('categories.selfDiscovery')}</SelectItem>
                  <SelectItem value="career">{t('categories.careerGuidance')}</SelectItem>
                  <SelectItem value="balance">{t('categories.lifeBalance')}</SelectItem>
                  <SelectItem value="motivation">{t('categories.motivation')}</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t('sortOptions.newest')}</SelectItem>
                  <SelectItem value="oldest">{t('sortOptions.oldest')}</SelectItem>
                  <SelectItem value="popular">{t('sortOptions.popular')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                {featuredPost.featuredImage ? (
                  <img 
                    src={featuredPost.featuredImage} 
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-64 md:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white" />
                  </div>
                )}
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-4">Featured</Badge>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.publishedAt && format(new Date(featuredPost.publishedAt), 'MMMM d, yyyy')}
                  </div>
                  {featuredPost.readingTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readingTime} min read
                    </div>
                  )}
                </div>
                <Link href={`/blog/${featuredPost.slug}`}>
                  <Button size="lg" className="group">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Regular Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg overflow-hidden">
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
              
              <CardContent className="p-6">
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
                
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="outline" className="w-full group/btn">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Back to Home */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}