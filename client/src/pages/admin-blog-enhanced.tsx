import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Calendar, Clock, Search, 
  FileText, Tag, 
  Archive, RefreshCw, Download, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from 'wouter';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { BlogPost } from "@shared/schema";
import BlogPostForm from "@/components/BlogPostForm";

interface BlogAnalytics {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalTags: number;
  recentPosts: BlogPost[];
}

export default function AdminBlogEnhanced() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_desc");

  // Queries
  const { data: allPosts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/admin/blog/posts'],
    enabled: isAuthenticated,
  });

  const { data: drafts } = useQuery<BlogPost[]>({
    queryKey: ['/api/admin/blog/drafts'],
    enabled: isAuthenticated,
  });

  const { data: analytics } = useQuery<BlogAnalytics>({
    queryKey: ['/api/admin/blog/analytics'],
    enabled: isAuthenticated,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest("DELETE", `/api/admin/blog/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/analytics'] });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (postIds: number[]) => {
      await apiRequest("POST", "/api/admin/blog/bulk-delete", { postIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/analytics'] });
      setSelectedPosts([]);
      toast({
        title: "Success",
        description: "Selected posts deleted successfully",
      });
    },
  });

  const bulkPublishMutation = useMutation({
    mutationFn: async (postIds: number[]) => {
      await apiRequest("POST", "/api/admin/blog/bulk-publish", { postIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/analytics'] });
      setSelectedPosts([]);
      toast({
        title: "Success",
        description: "Selected posts published successfully",
      });
    },
  });

  const bulkUnpublishMutation = useMutation({
    mutationFn: async (postIds: number[]) => {
      await apiRequest("POST", "/api/admin/blog/bulk-unpublish", { postIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/analytics'] });
      setSelectedPosts([]);
      toast({
        title: "Success",
        description: "Selected posts unpublished successfully",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async ({ postId, action }: { postId: number; action: 'publish' | 'unpublish' }) => {
      await apiRequest("POST", `/api/admin/blog/posts/${postId}/${action}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/posts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog/analytics'] });
      toast({
        title: "Success",
        description: `Blog post ${variables.action}ed successfully`,
      });
    },
  });

  // Filter and sort posts
  const filteredPosts = allPosts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "published" && post.isPublished) ||
                         (filterStatus === "draft" && !post.isPublished);
    const matchesTag = filterTag === "all" || (Array.isArray(post.tags) ? post.tags.includes(filterTag) : (post.tags as any)?.split(',').map((t: any) => t.trim()).includes(filterTag));
    
    return matchesSearch && matchesStatus && matchesTag;
  }) || [];

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "created_desc":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case "created_asc":
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      case "title_asc":
        return a.title.localeCompare(b.title);
      case "title_desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  // Get unique tags
  const allTags = allPosts?.flatMap(post => 
    Array.isArray(post.tags) ? post.tags : ((post.tags as any)?.split(',').map((tag: any) => tag.trim()) || [])
  ).filter((tag, index, arr) => tag && arr.indexOf(tag) === index) || [];

  const handleSelectPost = (postId: number, checked: boolean) => {
    if (checked) {
      setSelectedPosts(prev => [...prev, postId]);
    } else {
      setSelectedPosts(prev => prev.filter(id => id !== postId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(sortedPosts.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  if (authLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Blog Management</h1>
            <p className="text-gray-600 mt-2">Comprehensive blog administration with analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => queryClient.invalidateQueries()}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => window.location.href = '/admin/blog-import'}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Import Posts
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedPost ? "Edit Blog Post" : "Create New Blog Post"}
                  </DialogTitle>
                </DialogHeader>
                <BlogPostForm 
                  post={selectedPost}
                  onSuccess={() => {
                    setIsFormOpen(false);
                    setSelectedPost(null);
                  }}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setSelectedPost(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalPosts || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{analytics?.publishedPosts || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                  <Archive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{analytics?.draftPosts || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalTags || 0}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.recentPosts.map(post => (
                    <div key={post.id} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(post.createdAt || 0), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant={post.isPublished ? "default" : "secondary"}>
                        {post.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Posts Tab */}
          <TabsContent value="all" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterTag} onValueChange={setFilterTag}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {allTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_desc">Newest First</SelectItem>
                      <SelectItem value="created_asc">Oldest First</SelectItem>
                      <SelectItem value="title_asc">Title A-Z</SelectItem>
                      <SelectItem value="title_desc">Title Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bulk Actions */}
                {selectedPosts.length > 0 && (
                  <div className="flex items-center gap-4 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-sm font-medium">
                      {selectedPosts.length} post{selectedPosts.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => bulkPublishMutation.mutate(selectedPosts)}
                        disabled={bulkPublishMutation.isPending}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => bulkUnpublishMutation.mutate(selectedPosts)}
                        disabled={bulkUnpublishMutation.isPending}
                      >
                        <EyeOff className="h-4 w-4 mr-2" />
                        Unpublish
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Selected Posts</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {selectedPosts.length} selected post{selectedPosts.length > 1 ? 's' : ''}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => bulkDeleteMutation.mutate(selectedPosts)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}

                {/* Posts List */}
                <div className="space-y-4">
                  {/* Select All */}
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <Checkbox
                      id="select-all"
                      checked={selectedPosts.length === sortedPosts.length && sortedPosts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                      Select All ({sortedPosts.length} posts)
                    </label>
                  </div>

                  <AnimatePresence>
                    {sortedPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            checked={selectedPosts.includes(post.id)}
                            onCheckedChange={(checked) => handleSelectPost(post.id, checked as boolean)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900">{post.title}</h3>
                              <Badge variant={post.isPublished ? "default" : "secondary"}>
                                {post.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(post.createdAt || 0), 'MMM d, yyyy')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readingTime} min read
                              </div>
                              {post.tags && (
                                <div className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {Array.isArray(post.tags) 
                                    ? post.tags.slice(0, 2).join(', ')
                                    : (post.tags as string).split(',').slice(0, 2).join(', ')}
                                  {(Array.isArray(post.tags) ? post.tags.length : (post.tags as string).split(',').length) > 2 && '...'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedPost(post);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => publishMutation.mutate({
                              postId: post.id,
                              action: post.isPublished ? 'unpublish' : 'publish'
                            })}
                          >
                            {post.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{post.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(post.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {sortedPosts.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No posts found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drafts Tab */}
          <TabsContent value="drafts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Draft Posts</CardTitle>
                <p className="text-sm text-gray-600">Manage your unpublished content</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drafts?.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-gray-500">
                          Last updated: {format(new Date(post.updatedAt || 0), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPost(post);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => publishMutation.mutate({
                            postId: post.id,
                            action: 'publish'
                          })}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Publish
                        </Button>
                      </div>
                    </div>
                  ))}
                  {drafts?.length === 0 && (
                    <div className="text-center py-12">
                      <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No draft posts found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Settings</CardTitle>
                <p className="text-sm text-gray-600">Configure your blog management preferences</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto-save drafts</h3>
                      <p className="text-sm text-gray-500">Automatically save posts as drafts while editing</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">SEO optimization</h3>
                      <p className="text-sm text-gray-500">Automatically generate SEO metadata</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Export content</h3>
                      <p className="text-sm text-gray-500">Export all blog posts and data</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}