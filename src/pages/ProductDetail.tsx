import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useProductStore } from "@/store/productStore";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById } = useProductStore();
  const [selectedImage, setSelectedImage] = useState(0);
  
  if (!id) {
    return <Navigate to="/shop" replace />;
  }

  const product = getProductById(id);

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

  const handleBuyNow = () => {
    const message = `Hi! I'm interested in this product:

Product: ${product.title}
Brand: ${product.brand}
Price: Rs. ${product.price.toLocaleString()}
Product URL: ${window.location.href}

Please let me know about availability and how to proceed with the purchase.`;

    const whatsappUrl = `https://wa.me/923014539090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage] || product.mainImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                Brand: {product.brand}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">
                Rs. {product.price.toLocaleString()}
              </span>
              <Badge 
                variant={product.availability === 'In Stock' ? 'default' : 'destructive'}
              >
                {product.availability}
              </Badge>
            </div>

            {/* Additional Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">Category:</span>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              {product.color && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Color:</span>
                  <span className="text-muted-foreground">{product.color}</span>
                </div>
              )}
              {product.variant && (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Variant:</span>
                  <span className="text-muted-foreground">{product.variant}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Buy Now Button */}
            <div className="pt-4">
              <Button
                variant="whatsapp"
                size="lg"
                onClick={handleBuyNow}
                disabled={product.availability === 'Out of Stock'}
                className="w-full flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                Buy Now via WhatsApp
              </Button>
              
              {product.availability === 'Out of Stock' && (
                <p className="text-center text-muted-foreground text-sm mt-2">
                  This product is currently out of stock. Contact us for availability updates.
                </p>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-secondary/30 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Need Help?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Contact us for more information about this product or assistance with your purchase.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="https://wa.me/923014539090"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
                <a
                  href="mailto:info@ibelectricstore.com"
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    Email Us
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;