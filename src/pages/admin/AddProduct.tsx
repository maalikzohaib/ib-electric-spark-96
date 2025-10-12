import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import SearchSuggestions from "@/components/ui/search-suggestions";

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct, categories, fetchCategories, products } = useProductStore();
  const { pages, fetchPages } = usePageStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '' as string,
    brand: '',
    color: '',
    variant: '',
    size: '',
    in_stock: true,
    page_id: '' as string,
  });
  
  const [expandedMainPages, setExpandedMainPages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchCategories();
    fetchPages();
  }, [fetchCategories, fetchPages]);
  
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProductListed, setIsProductListed] = useState(false);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [brandHighlightedIndex, setBrandHighlightedIndex] = useState(-1);

  const uniqueBrands = Array.from(new Set(products.map(p => (p.brand || '').trim()).filter(Boolean)));
  const brandQuery = formData.brand.trim().toLowerCase();
  const brandSuggestions = brandQuery ? uniqueBrands.filter(b => b.toLowerCase().includes(brandQuery)).slice(0, 8) : [];

  useEffect(() => {
    const hasQuery = formData.brand.trim().length > 0;
    setShowBrandSuggestions(hasQuery);
    if (!hasQuery) setBrandHighlightedIndex(-1);
  }, [formData.brand]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? value : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'in_stock' ? value === 'true' : 
             name === 'page_id' && value === 'none' ? '' : value
    }));
    
    // Automatically expand the parent page when a subpage is selected
    if (name === 'page_id' && value !== 'none') {
      const selectedPage = pages.find(p => p.id === value);
      if (selectedPage?.parent_id) {
        setExpandedMainPages(prev => ({
          ...prev,
          [selectedPage.parent_id]: true
        }));
      }
    }
  };

  // Image uploads disabled; provide hosted URLs to avoid large bundles
  const handleImageUpload = async (_files: FileList | null) => {
    toast({
      title: "Uploads Disabled",
      description: "Image uploads are disabled. Please use image URLs.",
      variant: "destructive",
    });
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
    
    if (!formData.name || !formData.description || !formData.price || !formData.category_id || !formData.brand || !formData.page_id) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (name, description, price, category, brand, page).",
        variant: "destructive",
      });
      return;
    }

    if (imageUrls.length === 0) {
      toast({
        title: "Missing Image",
        description: "Please add at least one product image.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // Inform user immediately and prevent duplicate submissions
    toast({
      title: "Listing Product",
      description: "Your product will be listed shortly.",
    });

    try {
      // Use the already uploaded image URLs - no need to re-upload files that were already processed
      // by the handleImageUpload function
      let allImages = [...imageUrls];
      
      // Determine main image URL
      let mainImageUrl = '';
      if (allImages.length > 0) {
        mainImageUrl = mainImageIndex < allImages.length ? allImages[mainImageIndex] : allImages[0];
      }
      
      const newProduct = {
        ...formData,
        price: parseFloat(formData.price),
        image_url: mainImageUrl,
        images: allImages,
        featured: false,
        page_id: formData.page_id || null,
      };

      await addProduct(newProduct);
      
      toast({
        title: "Product Listed Successfully",
        description: `${formData.name} has been listed in the store.`,
      });
      
      // Mark product as listed to disable the button
      setIsProductListed(true);

      navigate('/admin/products');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Add Product</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Create a new product for your store
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                <div className="relative">
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Enter brand name"
                    required
                    onFocus={() => setShowBrandSuggestions(formData.brand.trim().length > 0)}
                    onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 100)}
                    onKeyDown={(e) => {
                      if (brandSuggestions.length === 0) return;
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setBrandHighlightedIndex(prev => Math.min(prev + 1, brandSuggestions.length - 1));
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setBrandHighlightedIndex(prev => Math.max(prev - 1, 0));
                      } else if (e.key === 'Enter' && brandHighlightedIndex >= 0) {
                        e.preventDefault();
                        const sel = brandSuggestions[brandHighlightedIndex];
                        setFormData(prev => ({ ...prev, brand: sel }));
                        setShowBrandSuggestions(false);
                      } else if (e.key === 'Escape') {
                        setShowBrandSuggestions(false);
                      }
                    }}
                  />
                  <SearchSuggestions
                    items={brandSuggestions.map(b => ({ id: b, name: b }))}
                    visible={showBrandSuggestions}
                    highlightedIndex={brandHighlightedIndex}
                    onHover={setBrandHighlightedIndex}
                    onSelect={(item) => {
                      setFormData(prev => ({ ...prev, brand: item.name }));
                      setShowBrandSuggestions(false);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="Enter product color"
                  />
                </div>
                <div>
                  <Label htmlFor="variant">Variant</Label>
                  <Input
                    id="variant"
                    name="variant"
                    value={formData.variant}
                    onChange={handleInputChange}
                    placeholder="Enter product variant"
                  />
                </div>
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="Enter product size"
                  />
                </div>
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

              <div>
                <Label htmlFor="in_stock">Availability</Label>
                <Select value={formData.in_stock.toString()} onValueChange={(value) => handleSelectChange('in_stock', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">In Stock</SelectItem>
                    <SelectItem value="false">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
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
          <Button type="submit" variant="store" disabled={isSubmitting || isProductListed}>
            {isProductListed ? 'Product Listed' : isSubmitting ? 'Listing Product...' : 'List Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;

