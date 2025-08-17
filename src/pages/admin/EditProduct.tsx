import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductStore } from "@/store/productStore";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Plus } from "lucide-react";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getProductById, updateProduct, categories } = useProductStore();
  const { toast } = useToast();
  
  const product = id ? getProductById(id) : null;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '' as string,
    brand: '',
    availability: 'In Stock' as 'In Stock' | 'Out of Stock',
    color: '',
    variant: '',
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [imageInput, setImageInput] = useState('');

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
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      brand: product.brand,
      availability: product.availability,
      color: product.color || '',
      variant: product.variant || '',
    });
    
    setImages(product.images);
    setMainImageIndex(product.images.indexOf(product.mainImage));
  }, [product, navigate, toast]);

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
  };

  const addImage = () => {
    if (imageInput.trim() && !images.includes(imageInput.trim())) {
      setImages(prev => [...prev, imageInput.trim()]);
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (mainImageIndex >= newImages.length) {
        setMainImageIndex(Math.max(0, newImages.length - 1));
      }
      return newImages;
    });
  };

  const setAsMainImage = (index: number) => {
    setMainImageIndex(index);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result && !images.includes(result)) {
            setImages(prev => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.category || !formData.brand) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Missing Images",
        description: "Please add at least one product image.",
        variant: "destructive",
      });
      return;
    }

    const updatedProduct = {
      ...formData,
      price: parseFloat(formData.price),
      category: formData.category as 'Fans' | 'Bulbs',
      images,
      mainImage: images[mainImageIndex],
    };

    updateProduct(id!, updatedProduct);
    
    toast({
      title: "Product Updated",
      description: `${formData.title} has been updated successfully.`,
    });

    navigate('/admin/products');
  };

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
        <p className="text-muted-foreground">
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
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter product title"
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
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
              </div>

              <div>
                <Label htmlFor="availability">Availability</Label>
                <Select value={formData.availability} onValueChange={(value) => handleSelectChange('availability', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Stock">In Stock</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
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
                <Label htmlFor="image-input">Add Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="image-input"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    placeholder="Enter image URL"
                  />
                  <Button type="button" onClick={addImage} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="file-input">Upload Images</Label>
                <Input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>

              {images.length > 0 && (
                <div>
                  <Label>Images ({images.length})</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className={`w-full h-24 object-cover rounded border-2 ${
                            index === mainImageIndex ? 'border-primary' : 'border-border'
                          }`}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-1">
                          {index !== mainImageIndex && (
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => setAsMainImage(index)}
                            >
                              Main
                            </Button>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        {index === mainImageIndex && (
                          <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1 rounded">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click "Main" to set the main product image. The main image will be displayed prominently.
                  </p>
                </div>
              )}

              {images.length === 0 && (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Add product images using URLs or upload files
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