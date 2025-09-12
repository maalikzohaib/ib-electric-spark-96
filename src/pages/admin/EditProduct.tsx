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
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Plus, Camera } from "lucide-react";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getProductById, updateProduct, categories } = useProductStore();
  const { pages, fetchPages } = usePageStore();
  const { toast } = useToast();
  
  const product = id ? getProductById(id) : null;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
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
    const newFiles = Array.from(files);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of newFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }
      
      setImageUrls(prev => [...prev, ...uploadedUrls]);
      setImageFiles(prev => [...prev, ...newFiles]);
      
      // If no main image selected and this is first upload, set first uploaded as main
      if (imageUrls.length === 0 && imageFiles.length === 0) {
        setMainImageIndex(0);
      }
      
      toast({
        title: "Images Uploaded",
        description: `${uploadedUrls.length} image(s) uploaded successfully.`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload images. Please try again.",
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
    
    if (!formData.name || !formData.price || !formData.category_id || !formData.brand) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
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
        price: parseFloat(formData.price),
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

              <div className="grid grid-cols-2 gap-4">
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

              {imageUrls.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Added URLs ({imageUrls.length})</Label>
                    {(imageUrls.length > 0 || imageFiles.length > 0) && (
                      <span className="text-xs text-muted-foreground">
                        Select main image by clicking the radio button
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 mt-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <input
                          type="radio"
                          name="mainImage"
                          checked={mainImageIndex === index}
                          onChange={() => setMainImageIndex(index)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm flex-1 truncate">{url}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImageUrl(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

              {imageFiles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Uploaded Images ({imageFiles.length})</Label>
                    {imageUrls.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        Select main image by clicking the radio button
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="absolute top-2 left-2 z-10">
                          <input
                            type="radio"
                            name="mainImage"
                            checked={mainImageIndex === imageUrls.length + index}
                            onChange={() => setMainImageIndex(imageUrls.length + index)}
                            className="w-4 h-4 text-primary bg-white rounded"
                          />
                        </div>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeImageFile(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {mainImageIndex === imageUrls.length + index && (
                          <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {imageUrls.length > 0 && (
                <div>
                  <Label>URL Previews</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
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