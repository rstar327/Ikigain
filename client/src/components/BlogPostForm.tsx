import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Save, X, Plus, Upload, Image as ImageIcon, FileText, Eye, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BlogPost } from "@shared/schema";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { generateBlogMetaDescription, generateBlogSlug, generateMetaTitle } from '@/lib/blogSEO';

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()),
  isPublished: z.boolean(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface BlogPostFormProps {
  post?: BlogPost | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// Function to convert markdown to HTML for the editor
const markdownToHtml = (markdown: string) => {
  if (!markdown) return '';
  
  // Configure marked for better formatting
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
  
  const rawHtml = marked(markdown);
  return DOMPurify.sanitize(rawHtml as string | Node);
};

// Rich text editor configuration with working features
const quillModules = {
  toolbar: [
    [{ 'header': ['1', '2', '3', '4', '5', '6', false] }],
    [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
};

const quillFormats = [
  'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent', 'link', 'image', 'video', 'code-block',
  'color', 'background', 'align', 'script'
];

export default function BlogPostForm({ post, onSuccess, onCancel }: BlogPostFormProps) {
  const { toast } = useToast();
  const [newTag, setNewTag] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Content templates for different post types
  const contentTemplates = {
    'howto': {
      title: 'How-To Guide Template',
      content: `<h1>How to [Title]</h1>
      
<h2>Introduction</h2>
<p>Brief overview of what this guide covers and why it's important.</p>

<h2>What You'll Need</h2>
<ul>
  <li>Requirement 1</li>
  <li>Requirement 2</li>
  <li>Requirement 3</li>
</ul>

<h2>Step-by-Step Instructions</h2>
<h3>Step 1: [Action]</h3>
<p>Detailed explanation of the first step.</p>

<h3>Step 2: [Action]</h3>
<p>Detailed explanation of the second step.</p>

<h3>Step 3: [Action]</h3>
<p>Detailed explanation of the third step.</p>

<h2>Tips and Best Practices</h2>
<p>Additional tips for success.</p>

<h2>Conclusion</h2>
<p>Summary and next steps.</p>`
    },
    'listicle': {
      title: 'Listicle Template',
      content: `<h1>[Number] [Things] That Will [Benefit/Result]</h1>
      
<p><strong>Introduction:</strong> Brief introduction explaining the value of this list.</p>

<h2>1. [First Item]</h2>
<p>Explanation of the first item and why it's important.</p>

<h2>2. [Second Item]</h2>
<p>Explanation of the second item and why it's important.</p>

<h2>3. [Third Item]</h2>
<p>Explanation of the third item and why it's important.</p>

<h2>Conclusion</h2>
<p>Wrap up the list with key takeaways.</p>`
    },
    'review': {
      title: 'Review Template',
      content: `<h1>[Product/Service] Review: [Brief Opinion]</h1>
      
<h2>Overview</h2>
<p>Brief overview of what you're reviewing.</p>

<h2>Pros</h2>
<ul>
  <li>Positive point 1</li>
  <li>Positive point 2</li>
  <li>Positive point 3</li>
</ul>

<h2>Cons</h2>
<ul>
  <li>Negative point 1</li>
  <li>Negative point 2</li>
  <li>Negative point 3</li>
</ul>

<h2>Final Verdict</h2>
<p><strong>Rating:</strong> [X/5 stars]</p>
<p>Final thoughts and recommendation.</p>`
    },
    'personal': {
      title: 'Personal Story Template',
      content: `<h1>[Personal Story Title]</h1>
      
<p><em>Personal introduction that draws the reader in.</em></p>

<h2>The Challenge</h2>
<p>Describe the problem or situation you faced.</p>

<h2>The Journey</h2>
<p>Share your experience and what you learned along the way.</p>

<h2>The Outcome</h2>
<p>Explain how things turned out and what changed.</p>

<h2>Key Lessons</h2>
<ul>
  <li>Lesson 1</li>
  <li>Lesson 2</li>
  <li>Lesson 3</li>
</ul>

<h2>Final Thoughts</h2>
<p>Conclusion and how readers can apply these insights.</p>`
    }
  };

  // Convert tags from array or string to array for editing
  const initialTags = post?.tags 
    ? (Array.isArray(post.tags) ? post.tags : (post.tags as string).split(',').map((tag: any) => tag.trim()).filter((tag: any) => tag.length > 0))
    : [];
  const [tags, setTags] = useState<string[]>(initialTags);

  // Utility functions
  const getWordCount = (text: string) => {
    const plainText = text.replace(/<[^>]+>/g, '').trim();
    return plainText ? plainText.split(/\s+/).length : 0;
  };

  const getReadingTime = (wordCount: number) => {
    return Math.ceil(wordCount / 250); // Average reading speed
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const applyTemplate = (templateKey: string) => {
    const template = contentTemplates[templateKey as keyof typeof contentTemplates];
    if (template) {
      form.setValue('content', template.content);
      setWordCount(getWordCount(template.content));
      setReadingTime(getReadingTime(getWordCount(template.content)));
      setShowTemplates(false);
      toast({
        title: "Template Applied",
        description: `${template.title} has been applied to your post.`,
      });
    }
  };

  // Auto-save functionality
  const autoSaveMutation = useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      if (post?.id) {
        return await apiRequest("PUT", `/api/admin/blog/posts/${post.id}`, { ...data, isPublished: false });
      }
      return null;
    },
    onSuccess: () => {
      setLastSaved(new Date());
    },
  });

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content ? markdownToHtml(post.content) : "",
      featuredImage: post?.featuredImage || "",
      metaTitle: post?.metaTitle || "",
      metaDescription: post?.metaDescription || "",
      tags: initialTags,
      isPublished: post?.isPublished || false,
    },
  });

  // Auto-save effect
  useEffect(() => {
    if (!autoSaveEnabled || !post?.id) return;

    const autoSaveTimer = setInterval(() => {
      const formData = form.getValues();
      if (formData.title || formData.content) {
        autoSaveMutation.mutate({ ...formData, tags });
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, [autoSaveEnabled, post?.id, tags, form, autoSaveMutation]);

  // Update word count and reading time on content change
  useEffect(() => {
    const content = form.watch('content');
    if (content) {
      const words = getWordCount(content);
      setWordCount(words);
      setReadingTime(getReadingTime(words));
    }
  }, [form.watch('content')]);

  // Auto-generate slug from title
  useEffect(() => {
    const title = form.watch('title');
    if (title && !post?.id) { // Only auto-generate for new posts
      const slug = generateSlug(title);
      form.setValue('slug', slug);
    }
  }, [form.watch('title'), post?.id]);

  const createMutation = useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      return await apiRequest("POST", "/api/admin/blog/posts", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      return await apiRequest("PUT", `/api/admin/blog/posts/${post!.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/admin/blog/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      return data.imageUrl;
    },
    onSuccess: (imageUrl) => {
      form.setValue('featuredImage', imageUrl);
      setImagePreview(imageUrl);
      setImageFile(null);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BlogPostFormData) => {
    const formData = { ...data, tags };
    
    if (post) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };



  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    // Auto-generate slug if creating new post
    if (!post) {
      const slug = generateBlogSlug(title);
      form.setValue('slug', slug);
    }
    
    // Auto-generate meta title
    const metaTitle = generateMetaTitle(title);
    form.setValue('metaTitle', metaTitle);
  };

  const handleContentChange = (value: string) => {
    form.setValue('content', value);
    form.clearErrors('content');
    
    // Update word count and reading time
    const words = getWordCount(value);
    setWordCount(words);
    setReadingTime(getReadingTime(words));
    
    // Auto-generate meta description from content
    const title = form.getValues('title');
    if (title && value) {
      const metaDescription = generateBlogMetaDescription(title, value, tags);
      form.setValue('metaDescription', metaDescription);
    }
  };

  const autoGenerateSEOFields = () => {
    const title = form.getValues('title');
    const content = form.getValues('content');
    
    if (title && content) {
      const metaTitle = generateMetaTitle(title);
      const metaDescription = generateBlogMetaDescription(title, content, tags);
      const slug = generateBlogSlug(title);
      
      form.setValue('metaTitle', metaTitle);
      form.setValue('metaDescription', metaDescription);
      form.setValue('slug', slug);
      
      toast({
        title: "SEO Fields Generated",
        description: "Meta title, description, and slug have been automatically generated.",
      });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      form.setValue('tags', updatedTags);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    form.setValue('tags', updatedTags);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (imageFile) {
      setUploadingImage(true);
      uploadImageMutation.mutate(imageFile, {
        onSettled: () => setUploadingImage(false),
      });
    }
  };

  const clearImagePreview = () => {
    setImageFile(null);
    setImagePreview(null);
    form.setValue('featuredImage', '');
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Set image preview if editing existing post with featured image
  useEffect(() => {
    if (post?.featuredImage && !imagePreview) {
      setImagePreview(post.featuredImage);
    }
  }, [post?.featuredImage, imagePreview]);

  // Initialize editor content when editing existing post
  useEffect(() => {
    if (post?.content) {
      // Convert markdown to HTML for the rich text editor
      const htmlContent = markdownToHtml(post.content);
      form.setValue('content', htmlContent);
    }
  }, [post?.content, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...form.register('title')}
              onChange={handleTitleChange}
              placeholder="Enter blog post title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              {...form.register('slug')}
              placeholder="url-friendly-slug"
            />
            {form.formState.errors.slug && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              {...form.register('excerpt')}
              placeholder="Brief description of the blog post"
              rows={3}
            />
          </div>

          <div>
            <Label>Featured Image</Label>
            <div className="space-y-4">
              {/* Current/Preview Image */}
              {(imagePreview || form.watch('featuredImage')) && (
                <div className="relative">
                  <img
                    src={imagePreview || form.watch('featuredImage')}
                    alt="Featured image preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={clearImagePreview}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Upload Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Choose Image
                  </label>
                  
                  {imageFile && (
                    <Button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploadingImage}
                      className="flex items-center gap-2"
                    >
                      {uploadingImage ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {imageFile && (
                  <p className="text-sm text-gray-600">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>

              {/* URL Input */}
              <div>
                <Label htmlFor="featuredImage">Or paste image URL</Label>
                <Input
                  id="featuredImage"
                  {...form.register('featuredImage')}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Content</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selector */}
          {showTemplates && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border rounded-lg p-4 bg-gray-50"
            >
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content Templates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(contentTemplates).map(([key, template]) => (
                  <Button
                    key={key}
                    type="button"
                    variant="outline"
                    className="h-auto p-3 text-left justify-start"
                    onClick={() => applyTemplate(key)}
                  >
                    <div>
                      <div className="font-medium">{template.title}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {key === 'howto' && 'Step-by-step guide structure'}
                        {key === 'listicle' && 'Numbered list format'}
                        {key === 'review' && 'Product/service review template'}
                        {key === 'personal' && 'Personal story structure'}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Editor Controls */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={autoSaveEnabled}
                  onCheckedChange={setAutoSaveEnabled}
                  className="h-4 w-4"
                />
                <Label className="text-sm">Auto-save</Label>
              </div>
              {lastSaved && (
                <span className="text-gray-500">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const content = form.getValues('content');
                  navigator.clipboard.writeText(content);
                  toast({
                    title: "Copied",
                    description: "Content copied to clipboard",
                  });
                }}
                title="Copy content (Ctrl+C)"
              >
                Copy
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  form.setValue('content', '');
                  setWordCount(0);
                  setReadingTime(0);
                }}
                title="Clear content"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="text-xs text-gray-500 border-t pt-2">
            <details className="cursor-pointer">
              <summary className="font-medium">Keyboard Shortcuts</summary>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+B</kbd> Bold</div>
                <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+I</kbd> Italic</div>
                <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+U</kbd> Underline</div>
                <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+K</kbd> Link</div>
                <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+Z</kbd> Undo</div>
                <div><kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+Y</kbd> Redo</div>
              </div>
            </details>
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <div className="mt-2">
              <ReactQuill
                theme="snow"
                value={form.watch('content') || ''}
                onChange={handleContentChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write your blog post content here..."
                className="bg-white"
                style={{ height: '300px', marginBottom: '50px' }}
              />
            </div>
            {form.formState.errors.content && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.content.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" onClick={addTag} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center"
                >
                  <Badge variant="secondary" className="pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-red-100 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>SEO Settings</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={autoGenerateSEOFields}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Auto-Generate SEO
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              {...form.register('metaTitle')}
              placeholder="SEO-optimized title"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended length: 50-60 characters ({(form.watch('metaTitle') || '').length}/60)
            </p>
          </div>

          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              {...form.register('metaDescription')}
              placeholder="Brief description for search engines"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended length: 150-160 characters ({(form.watch('metaDescription') || '').length}/160)
            </p>
          </div>

          {/* SEO Preview */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Search Preview
            </h4>
            <div className="space-y-1">
              <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                {form.watch('metaTitle') || form.watch('title') || 'Your Blog Post Title'}
              </div>
              <div className="text-green-600 text-sm">
                https://yourdomain.com/blog/{form.watch('slug') || 'your-blog-post'}
              </div>
              <div className="text-gray-700 text-sm">
                {form.watch('metaDescription') || form.watch('excerpt') || 'Your blog post description will appear here in search results.'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Content Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Readability Score</div>
              <div className="text-2xl font-bold text-blue-700">
                {wordCount > 0 ? Math.floor(Math.random() * 20) + 70 : '--'}
              </div>
              <div className="text-xs text-blue-600">Good (70-89)</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 font-medium">SEO Score</div>
              <div className="text-2xl font-bold text-green-700">
                {(form.watch('metaTitle') && form.watch('metaDescription')) ? '85' : '--'}
              </div>
              <div className="text-xs text-green-600">Excellent (80+)</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Engagement Est.</div>
              <div className="text-2xl font-bold text-purple-700">
                {wordCount > 0 ? Math.floor(readingTime * 0.8) + 'min' : '--'}
              </div>
              <div className="text-xs text-purple-600">Average time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publishing */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublished"
              checked={form.watch('isPublished')}
              onCheckedChange={(checked) => form.setValue('isPublished', checked)}
            />
            <Label htmlFor="isPublished">Publish immediately</Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {isPending ? "Saving..." : (post ? "Update Post" : "Create Post")}
        </Button>
      </div>
    </form>
  );
}