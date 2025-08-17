import { Link } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/store/productStore";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className = "" }: ProductCardProps) => {
  return (
    <div className={`group bg-card rounded-2xl shadow-card border-0 overflow-hidden transition-all duration-500 hover:shadow-elegant hover:-translate-y-2 animate-scale-in ${className}`}>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
        <img
          src={product.mainImage}
          alt={product.title}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.availability === 'Out of Stock' && (
          <Badge 
            variant="destructive" 
            className="absolute top-3 right-3 z-20"
          >
            Out of Stock
          </Badge>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-foreground text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {product.title}
          </h3>
          <p className="text-muted-foreground text-sm font-medium">
            {product.brand}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold text-2xl">
            Rs. {product.price.toLocaleString()}
          </span>
          <Badge 
            variant={product.availability === 'In Stock' ? 'default' : 'destructive'}
            className="text-xs px-3 py-1"
          >
            {product.availability}
          </Badge>
        </div>
        
        <Link to={`/product/${product.id}`} className="block">
          <Button 
            variant="store" 
            className="w-full group-hover:bg-primary group-hover:scale-105 transition-all duration-300"
            disabled={product.availability === 'Out of Stock'}
          >
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;