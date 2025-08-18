import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductStore } from "@/store/productStore";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Plus, Camera } from "lucide-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct, categories, fetchCategories, loading } = useProductStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '' as string,
    brand: '',
    color: '',
    variant: '',
    in_stock: true,
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  const [imageUrl, setImageUrl] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

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
      [name]: name === 'in_stock' ? value === 'true' : value
    }));
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
      
      if (uploadedUrls.length > 0) {
        setImageUrl(uploadedUrls[0]); // Set first image as main image
      }
      
      setImageFiles(prev => [...prev, ...newFiles]);
      
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

    if (!imageUrl && imageFiles.length === 0) {
      toast({
        title: "Missing Image",
        description: "Please add a product image.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newProduct = {
        ...formData,
        price: parseFloat(formData.price),
        image_url: imageUrl,
        featured: false,
      };

      await addProduct(newProduct);
      
      toast({
        title: "Product Added",
        description: `${formData.name} has been added to the store.`,
      });

      navigate('/admin/products');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add Product</h1>
        <p className="text-muted-foreground">
          Create a new product for your store
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

              <div className="grid grid-cols-2 gap-4">
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
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
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

              {imageFiles.length > 0 && (
                <div>
                  <Label>Uploaded Images ({imageFiles.length})</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative">
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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {imageUrl && (
                <div>
                  <Label>URL Preview</Label>
                  <div className="mt-2">
                    <img
                      src={imageUrl}
                      alt="Product preview"
                      className="w-full h-48 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}

              {!imageUrl && imageFiles.length === 0 && (
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
          <Button type="submit" variant="store" disabled={loading}>
            {loading ? 'Adding Product...' : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;