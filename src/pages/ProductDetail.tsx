import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProductStore();
  const { toast } = useToast();

  const product = id ? getProductById(id) : undefined;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/shop')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button onClick={() => navigate('/shop')} className="hover:text-primary transition-colors">
            Shop
          </button>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-card">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
              {!product.in_stock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  Rs. {product.price.toLocaleString()}
                </span>
                <Badge variant={product.in_stock ? 'default' : 'destructive'} className="text-sm">
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </Badge>
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Brand:</span>
                    <span className="ml-2 text-foreground">{product.brand}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Availability:</span>
                    <span className="ml-2 text-foreground">
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="store"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Back to Shop */}
            <Button variant="ghost" onClick={() => navigate('/shop')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;