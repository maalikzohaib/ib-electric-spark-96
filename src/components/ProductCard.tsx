import { Link } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/store/productStore";
import { formatProductPrice, isSaleActive } from "@/store/productStore";
import { useFavoriteStore } from "@/store/favoriteStore";
import { useCartStore } from "@/store/cartStore";
import { Heart, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className = "" }: ProductCardProps) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoriteStore();
  const { addToCart } = useCartStore();
  const { toast } = useToast();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const isProductFavorite = isFavorite(product.id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isTogglingFavorite) return;

    setIsTogglingFavorite(true);

    try {
      if (isProductFavorite) {
        removeFromFavorites(product.id);
        toast({
          title: "Removed from favorites",
          description: `${product.name} has been removed from your favorites.`,
          variant: "default"
        });
      } else {
        addToFavorites(product);
        toast({
          title: "Added to favorites",
          description: `${product.name} has been added to your favorites.`,
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      // Simulate a delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  return (
    <div
      className={`group bg-card rounded-2xl shadow-lg border-0 overflow-hidden transition-all duration-500 hover:shadow-elegant hover:-translate-y-2 animate-scale-in ${className}`}
      role="article"
      aria-labelledby={`product-${product.id}-title`}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>

        {/* Favorite Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-3 left-3 z-20 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all duration-200"
          onClick={handleToggleFavorite}
          disabled={isTogglingFavorite}
          aria-label={isProductFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isTogglingFavorite ? (
            <Spinner size="sm" variant="primary" />
          ) : (
            <Heart className={`h-4 w-4 ${isProductFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          )}
        </Button>
        <img
          src={product.images && product.images.length > 0 ? product.images[0] : product.image_url}
          alt={product.name}
          className="w-full h-56 object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
        <Badge
          variant={product.in_stock ? 'default' : 'destructive'}
          className="absolute top-3 right-3 z-20 bg-opacity-90 backdrop-blur-sm"
        >
          {product.in_stock ? 'In Stock' : 'Out of Stock'}
        </Badge>
        {isSaleActive(product) && (
          <Badge
            variant="default"
            className="absolute top-12 right-3 z-20 bg-red-500 text-white hover:bg-red-600"
          >
            Sale
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      <div className="p-4 space-y-3 sm:p-5">
        <div className="space-y-2">
          <h3
            id={`product-${product.id}-title`}
            className="font-bold text-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300"
          >
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm font-medium line-clamp-1">
            {product.brand || product.category?.name || ""}
            {product.size && <span className="ml-2">• Size: {product.size}</span>}
          </p>
        </div>

        <div className="flex items-center justify-between">
          {(() => {
            const priceInfo = formatProductPrice(product);
            return (
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold text-2xl">
                  {priceInfo.display}
                </span>
                {priceInfo.isSale && priceInfo.original && (
                  <span className="text-gray-400 line-through text-lg">
                    {priceInfo.original}
                  </span>
                )}
              </div>
            );
          })()}
          <Badge
            variant={product.in_stock ? 'default' : 'destructive'}
            className="text-xs px-3 py-1"
          >
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mb-2 mt-4 sm:mt-2">
          <Button
            variant="outline"
            className="w-full sm:flex-1 group-hover:border-primary group-hover:text-primary transition-all duration-300 whitespace-nowrap py-2 px-3 h-auto"
            disabled={!product.in_stock || isAddingToCart}
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            {isAddingToCart ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>

          <Link
            to={`/product/${product.id}`}
            className="w-full sm:flex-1"
            aria-label={`View details for ${product.name}`}
          >
            <Button
              variant="store"
              className="w-full group-hover:bg-primary group-hover:scale-105 transition-all duration-300 whitespace-nowrap py-2 px-3 h-auto"
              disabled={!product.in_stock}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.location.href = `/product/${product.id}`;
                }
              }}
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;