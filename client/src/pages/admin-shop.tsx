import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
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
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Package, 
  DollarSign, 
  ShoppingCart,
  Save,
  X,
  ArrowLeft
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'wouter';

interface ShopProduct {
  id: number;
  name: string;
  subtitle?: string;
  description?: string;
  price: string;
  originalPrice?: string;
  currency: string;
  features: string[];
  benefits: string[];
  images: string[];
  badge?: string;
  isActive: boolean;
  stockQuantity: number;
  limitedQuantity: boolean;
  shipping: any;
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  subtitle: string;
  description: string;
  price: string;
  originalPrice: string;
  currency: string;
  features: string;
  benefits: string;
  images: string;
  badge: string;
  isActive: boolean;
  stockQuantity: number;
  limitedQuantity: boolean;
  metaTitle: string;
  metaDescription: string;
  tags: string;
}

export default function AdminShop() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ShopProduct | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    subtitle: '',
    description: '',
    price: '',
    originalPrice: '',
    currency: 'USD',
    features: '',
    benefits: '',
    images: '',
    badge: '',
    isActive: true,
    stockQuantity: 0,
    limitedQuantity: false,
    metaTitle: '',
    metaDescription: '',
    tags: ''
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<any[]>({
    queryKey: ['/api/admin/shop/products'],
    enabled: isAuthenticated,
    retry: false,
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: ProductFormData) => {
      const response = await apiRequest('POST', '/api/admin/shop/products', productData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/shop/products'] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, productData }: { id: number; productData: ProductFormData }) => {
      const response = await apiRequest('PUT', `/api/admin/shop/products/${id}`, productData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/shop/products'] });
      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/shop/products/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/shop/products'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const toggleProductStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const endpoint = isActive ? 'activate' : 'deactivate';
      const response = await apiRequest('POST', `/api/admin/shop/products/${id}/${endpoint}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/shop/products'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product status",
        variant: "destructive",
      });
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const response = await apiRequest('POST', `/api/admin/shop/products/${id}/stock`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Stock updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/shop/products'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update stock",
        variant: "destructive",
      });
    },
  });

  const seedShopMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/admin/shop/seed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Shop seeded with initial product",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/shop/products'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to seed shop",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      subtitle: '',
      description: '',
      price: '',
      originalPrice: '',
      currency: 'USD',
      features: '',
      benefits: '',
      images: '',
      badge: '',
      isActive: true,
      stockQuantity: 0,
      limitedQuantity: false,
      metaTitle: '',
      metaDescription: '',
      tags: ''
    });
  };

  const handleEdit = (product: ShopProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      subtitle: product.subtitle || '',
      description: product.description || '',
      price: product.price,
      originalPrice: product.originalPrice || '',
      currency: product.currency,
      features: Array.isArray(product.features) ? product.features.join(', ') : '',
      benefits: Array.isArray(product.benefits) ? product.benefits.join(', ') : '',
      images: Array.isArray(product.images) ? product.images.join(', ') : '',
      badge: product.badge || '',
      isActive: product.isActive,
      stockQuantity: product.stockQuantity,
      limitedQuantity: product.limitedQuantity,
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, productData: formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  const handleToggleStatus = (id: number, currentStatus: boolean) => {
    toggleProductStatusMutation.mutate({ id, isActive: !currentStatus });
  };

  const handleStockUpdate = (id: number, quantity: number) => {
    updateStockMutation.mutate({ id, quantity });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navigation />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Management</h1>
            <p className="text-gray-600">Manage your shop products, pricing, and inventory</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{products.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {products.filter((p: ShopProduct) => p.isActive).length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${products.reduce((sum: number, p: ShopProduct) => sum + parseFloat(p.price), 0).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {products.filter((p: ShopProduct) => p.stockQuantity < 10).length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Products</h2>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingProduct(null);
                        resetForm();
                      }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingProduct ? 'Update product information' : 'Create a new product for your shop'}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Input
                              id="subtitle"
                              value={formData.subtitle}
                              onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="price">Price *</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) => setFormData({...formData, price: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="originalPrice">Original Price</Label>
                            <Input
                              id="originalPrice"
                              type="number"
                              step="0.01"
                              value={formData.originalPrice}
                              onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="currency">Currency</Label>
                            <Input
                              id="currency"
                              value={formData.currency}
                              onChange={(e) => setFormData({...formData, currency: e.target.value})}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="features">Features (comma-separated)</Label>
                          <Textarea
                            id="features"
                            value={formData.features}
                            onChange={(e) => setFormData({...formData, features: e.target.value})}
                            placeholder="Feature 1, Feature 2, Feature 3"
                            rows={2}
                          />
                        </div>

                        <div>
                          <Label htmlFor="benefits">Benefits (comma-separated)</Label>
                          <Textarea
                            id="benefits"
                            value={formData.benefits}
                            onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                            placeholder="Benefit 1, Benefit 2, Benefit 3"
                            rows={2}
                          />
                        </div>

                        <div>
                          <Label htmlFor="images">Image URLs (comma-separated)</Label>
                          <Textarea
                            id="images"
                            value={formData.images}
                            onChange={(e) => setFormData({...formData, images: e.target.value})}
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                            rows={2}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="badge">Badge</Label>
                            <Input
                              id="badge"
                              value={formData.badge}
                              onChange={(e) => setFormData({...formData, badge: e.target.value})}
                              placeholder="New, Sale, Featured"
                            />
                          </div>
                          <div>
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input
                              id="tags"
                              value={formData.tags}
                              onChange={(e) => setFormData({...formData, tags: e.target.value})}
                              placeholder="tag1, tag2, tag3"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="stockQuantity">Stock Quantity</Label>
                            <Input
                              id="stockQuantity"
                              type="number"
                              value={formData.stockQuantity}
                              onChange={(e) => setFormData({...formData, stockQuantity: parseInt(e.target.value) || 0})}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="limitedQuantity"
                              checked={formData.limitedQuantity}
                              onCheckedChange={(checked) => setFormData({...formData, limitedQuantity: checked})}
                            />
                            <Label htmlFor="limitedQuantity">Limited Quantity</Label>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                          />
                          <Label htmlFor="isActive">Active</Label>
                        </div>

                        <Separator />

                        <div>
                          <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                          <Input
                            id="metaTitle"
                            value={formData.metaTitle}
                            onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                            placeholder="SEO optimized title"
                          />
                        </div>

                        <div>
                          <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                          <Textarea
                            id="metaDescription"
                            value={formData.metaDescription}
                            onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                            placeholder="SEO optimized description"
                            rows={2}
                          />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button 
                            type="submit"
                            disabled={createProductMutation.isPending || updateProductMutation.isPending}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {editingProduct ? 'Update' : 'Create'} Product
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoadingProducts ? (
                    <div className="col-span-full text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading products...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-4">No products found. Create your first product!</p>
                      <Button
                        onClick={() => seedShopMutation.mutate()}
                        disabled={seedShopMutation.isPending}
                        className="mr-2"
                      >
                        {seedShopMutation.isPending ? "Seeding..." : "Add Ikigai Cards Product"}
                      </Button>
                    </div>
                  ) : (
                    products.map((product: ShopProduct) => (
                      <Card key={product.id} className="relative">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{product.name}</CardTitle>
                              {product.subtitle && (
                                <p className="text-sm text-gray-600 mt-1">{product.subtitle}</p>
                              )}
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleStatus(product.id, product.isActive)}
                              >
                                {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(product.id)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Price:</span>
                              <span className="font-semibold">${product.price}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Stock:</span>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="number"
                                  className="w-16 h-8"
                                  defaultValue={product.stockQuantity}
                                  onBlur={(e) => {
                                    const newQuantity = parseInt(e.target.value) || 0;
                                    if (newQuantity !== product.stockQuantity) {
                                      handleStockUpdate(product.id, newQuantity);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Status:</span>
                              <Badge variant={product.isActive ? "default" : "secondary"}>
                                {product.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            {product.badge && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Badge:</span>
                                <Badge variant="outline">{product.badge}</Badge>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Shop Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {products.map((product: ShopProduct) => (
                          <div key={product.id} className="flex justify-between items-center">
                            <span className="text-sm">{product.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">${product.price}</span>
                              <Badge variant={product.isActive ? "default" : "secondary"}>
                                {product.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Inventory Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {products.map((product: ShopProduct) => (
                          <div key={product.id} className="flex justify-between items-center">
                            <span className="text-sm">{product.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{product.stockQuantity} units</span>
                              <Badge variant={product.stockQuantity < 10 ? "destructive" : "default"}>
                                {product.stockQuantity < 10 ? "Low Stock" : "In Stock"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}