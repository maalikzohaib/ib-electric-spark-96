import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductStore } from "@/store/productStore";
import { usePageStore } from "@/store/pageStore";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Plus, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getProductById, updateProduct, categories, fetchProducts, productsFetched } = useProductStore();
  const { pages, fetchPages } = usePageStore();
  const { toast } = useToast();

  const product = id ? getProductById(id) : null;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    price_type: 'single' as 'single' | 'range',
    price_min: '',
    price_max: '',
    category_id: '' as string,
    brand: '',
    in_stock: true,
    color: '',
    variant: '',
    size: '',
    page_id: '' as string,
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [expandedMainPages, setExpandedMainPages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPages();
    // Fetch products if not already loaded
    if (!productsFetched) {
      fetchProducts();
    }
  }, [fetchPages, fetchProducts, productsFetched]);

  useEffect(() => {
    if (!product) {
      toast({
        title: "Product Not Found",
        description: "The product you're trying to edit doesn't exist.",
        variant: "destructive",
      });
      navigate('/admin/products');
      return;
    }

    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      price_type: product.price_type || 'single',
      price_min: product.price_min?.toString() || '',
      price_max: product.price_max?.toString() || '',
      category_id: product.category_id || '',
      brand: product.brand || '',
      in_stock: product.in_stock,
      color: (product as any).color || '',
      variant: (product as any).variant || '',
      size: (product as any).size || '',
      page_id: product.page_id || '',
    });

    // Initialize image URLs from product data
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      setImageUrls(product.images);
      // Find the index of the main image in the images array
      const mainIndex = product.images.findIndex(url => url === product.image_url);
      setMainImageIndex(mainIndex >= 0 ? mainIndex : 0);
    } else if (product.image_url) {
      // If no images array but has image_url, use it as the only image
      setImageUrls([product.image_url]);
      setMainImageIndex(0);
    }
  }, [product, navigate, toast, fetchPages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If selecting a page, expand its parent in the UI
    if (name === 'page_id') {
      const selectedPage = pages.find(p => p.id === value);
      if (selectedPage?.parent_id) {
        // Automatically expand the parent page when a subpage is selected
        setExpandedMainPages(prev => ({
          ...prev,
          [selectedPage.parent_id]: true
        }));
      }
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];
    const errors: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (error) {
          console.error('Error uploading file:', error);
          errors.push(file.name);
          continue;
        }

        if (data) {
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          newUrls.push(publicUrl);
        }
      }

      if (newUrls.length > 0) {
        setImageUrls(prev => {
          const updated = [...prev, ...newUrls];
          // If this is the first image, set it as main
          if (prev.length === 0 && imageFiles.length === 0) {
            setMainImageIndex(0);
          }
          return updated;
        });

        toast({
          title: "Upload Successful",
          description: `Successfully uploaded ${newUrls.length} image(s).`,
        });
      }

      if (errors.length > 0) {
        toast({
          title: "Upload Errors",
          description: `Failed to upload: ${errors.join(', ')}`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImageFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    // Adjust main image index if necessary
    const urlsCount = imageUrls.length;
    const adjustedIndex = index + urlsCount;
    if (mainImageIndex === adjustedIndex) {
      setMainImageIndex(0);
    } else if (mainImageIndex > adjustedIndex) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    // Adjust main image index if necessary
    const totalImages = imageUrls.length + imageFiles.length;
    if (mainImageIndex >= totalImages - 1) {
      setMainImageIndex(Math.max(0, totalImages - 2));
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
      // If this is the first image, set it as main
      if (imageUrls.length === 0 && imageFiles.length === 0) {
        setMainImageIndex(0);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const isPriceValid = formData.price_type === 'single' 
      ? formData.price 
      : (formData.price_min && formData.price_max);

    if (!formData.name || !isPriceValid || !formData.category_id || !formData.brand) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate price range
    if (formData.price_type === 'range') {
      const minPrice = parseFloat(formData.price_min);
      const maxPrice = parseFloat(formData.price_max);
      if (minPrice >= maxPrice) {
        toast({
          title: "Invalid Price Range",
          description: "Minimum price must be less than maximum price.",
          variant: "destructive",
        });
        return;
      }
    }

    if (imageUrls.length === 0 && imageFiles.length === 0) {
      toast({
        title: "Missing Image",
        description: "Please add at least one product image.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use the already uploaded image URLs - no need to re-upload files that were already processed
      // by the handleImageUpload function
      let allImages = [...imageUrls];

      // Only upload files that haven't been processed yet
      // We don't need to upload files here as they should have already been uploaded
      // by the handleImageUpload function and their URLs added to imageUrls

      // Determine main image URL
      let mainImageUrl = '';
      if (allImages.length > 0) {
        mainImageUrl = mainImageIndex < allImages.length ? allImages[mainImageIndex] : allImages[0];
      }

      const updatedProduct = {
        name: formData.name,
        description: formData.description,
        price: formData.price_type === 'single' 
          ? parseFloat(formData.price) 
          : parseFloat(formData.price_min), // Use min price as base price for range
        price_type: formData.price_type,
        price_min: formData.price_type === 'range' ? parseFloat(formData.price_min) : null,
        price_max: formData.price_type === 'range' ? parseFloat(formData.price_max) : null,
        category_id: formData.category_id,
        brand: formData.brand,
        in_stock: formData.in_stock,
        image_url: mainImageUrl,
        images: allImages,
        color: formData.color || null,
        variant: formData.variant || null,
        size: formData.size || null,
        page_id: formData.page_id || null,
      };

      await updateProduct(id!, updatedProduct);

      toast({
        title: "Product Updated",
        description: `${formData.name} has been updated successfully.`,
      });

      navigate('/admin/products');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Edit Product</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Update product information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the product features and benefits"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label>Price Type *</Label>
                  <Select value={formData.price_type} onValueChange={(value) => handleSelectChange('price_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Price (e.g., Rs. 800)</SelectItem>
                      <SelectItem value="range">Price Range (e.g., Rs. 500-1000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.price_type === 'single' ? (
                  <div>
                    <Label htmlFor="price">Price (Rs.) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="price_min">Minimum Price (Rs.) *</Label>
                      <Input
                        id="price_min"
                        name="price_min"
                        type="number"
                        value={formData.price_min}
                        onChange={handleInputChange}
                        placeholder="500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_max">Maximum Price (Rs.) *</Label>
                      <Input
                        id="price_max"
                        name="price_max"
                        type="number"
                        value={formData.price_max}
                        onChange={handleInputChange}
                        placeholder="1000"
                        required
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <Label htmlFor="category_id">Category *</Label>
                  <Select value={formData.category_id} onValueChange={(value) => handleSelectChange('category_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., White, Black"
                  />
                </div>
                <div>
                  <Label htmlFor="variant">Variant</Label>
                  <Input
                    id="variant"
                    name="variant"
                    value={formData.variant}
                    onChange={handleInputChange}
                    placeholder="e.g., 52 inch, 9W"
                  />
                </div>
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="e.g., Small, Medium, Large"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="in_stock">Availability</Label>
                <Select value={formData.in_stock ? 'true' : 'false'} onValueChange={(value) => setFormData(prev => ({ ...prev, in_stock: value === 'true' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">In Stock</SelectItem>
                    <SelectItem value="false">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="page_id">Select Page (Required)</Label>
                <div className="space-y-4 mt-2 border rounded-md p-4">
                  {/* Main pages with plus buttons */}
                  <div className="space-y-2">
                    {pages
                      .filter(page => page.parent_id === null && page.name && page.name.trim() !== '') // Only show main pages with valid names
                      .map((mainPage) => {
                        const subPages = pages.filter(p => p.parent_id === mainPage.id && p.name && p.name.trim() !== '');
                        const isExpanded = expandedMainPages[mainPage.id] || false;

                        return (
                          <div key={mainPage.id} className="space-y-2">
                            <div className="flex items-center">
                              <span className="flex-1 font-medium">{mainPage.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedMainPages(prev => ({
                                  ...prev,
                                  [mainPage.id]: !isExpanded
                                }))}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            {isExpanded && (
                              <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                                {subPages.length > 0 ? (
                                  subPages.map(subPage => (
                                    <div key={subPage.id} className="flex items-center">
                                      <input
                                        type="radio"
                                        id={`page-${subPage.id}`}
                                        name="page_id"
                                        value={subPage.id}
                                        checked={formData.page_id === subPage.id}
                                        onChange={() => handleSelectChange('page_id', subPage.id)}
                                        className="mr-2"
                                      />
                                      <label htmlFor={`page-${subPage.id}`} className="text-sm">
                                        {subPage.name}
                                      </label>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">No subpages available</p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {/* Preview of selected page */}
                  {formData.page_id && (
                    <div className="mt-4 p-2 bg-muted rounded-md">
                      <p className="text-sm font-medium">Selected Page:</p>
                      <p className="text-sm">
                        {(() => {
                          const selectedPage = pages.find(p => p.id === formData.page_id);
                          const parentPage = selectedPage?.parent_id ?
                            pages.find(p => p.id === selectedPage.parent_id) : null;

                          return parentPage ?
                            `${parentPage.name} → ${selectedPage?.name}` :
                            selectedPage?.name;
                        })()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images Gallery</CardTitle>
              <p className="text-sm text-muted-foreground">Upload multiple images to showcase your product</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image-url">Add Image URLs</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="image-url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    onKeyPress={(e) => e.key === 'Enter' && addImageUrl()}
                  />
                  <Button type="button" onClick={addImageUrl} disabled={!newImageUrl.trim()} className="w-full sm:w-auto mt-2 sm:mt-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>



              <div className="text-center text-muted-foreground">OR</div>

              <div>
                <Label>Upload from Device</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer border-2 border-dashed border-border rounded-lg p-8 text-center block hover:border-primary transition-colors"
                  >
                    {uploading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Click to upload images from your device
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Support: JPG, PNG, GIF (Max 10MB each)
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>



              {imageUrls.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Product Images ({imageUrls.length})</Label>
                    <span className="text-xs text-muted-foreground">
                      Set main image by clicking the button on the image
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className={`relative group aspect-square rounded-lg border-2 overflow-hidden ${mainImageIndex === index ? 'border-primary' : 'border-muted'}`}>
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                          <Button
                            type="button"
                            variant={mainImageIndex === index ? "default" : "secondary"}
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => setMainImageIndex(index)}
                          >
                            {mainImageIndex === index ? 'Main Image' : 'Set as Main'}
                          </Button>

                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => removeImageUrl(index)}
                          >
                            <span className="flex items-center gap-1">
                              <X className="h-3 w-3" /> Remove
                            </span>
                          </Button>
                        </div>

                        {/* Main Badge */}
                        {mainImageIndex === index && (
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {imageUrls.length === 0 && imageFiles.length === 0 && (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Add product images using URL or upload from device
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="store">
            Update Product
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
