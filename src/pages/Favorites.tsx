import { useEffect } from 'react';
import { useFavoriteStore } from '@/store/favoriteStore';
import { useProductStore } from '@/store/productStore';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/enhanced-button';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Favorites = () => {
  const { favorites, clearFavorites } = useFavoriteStore();
  const { products, fetchProducts, productsFetched } = useProductStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!productsFetched) {
      fetchProducts();
    }
  }, [productsFetched, fetchProducts]);

  const favoriteProducts = products.filter(product => 
    favorites.includes(product.id)
  );

  const handleClearFavorites = () => {
    clearFavorites();
    toast({
      title: 'Favorites cleared',
      description: 'All products have been removed from your favorites',
    });
  };

  const handleNavigateToShop = () => {
    window.location.href = '/shop';
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        {favoriteProducts.length > 0 && (
          <Button variant="destructive" onClick={handleClearFavorites}>
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
          </Button>
        )}
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Your favorites list is empty</h2>
          <p className="text-gray-500 mb-8">Add products to your favorites to see them here</p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <InteractiveHoverButton
              text="Add More"
              className="w-44 h-12 text-base shadow-lg hover:shadow-xl transition-shadow duration-300"
              onClick={handleNavigateToShop}
            />
            <p className="text-sm text-gray-500 mt-2">
              Click to browse more products to add to your favorites
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;