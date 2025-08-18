import React from 'react';
import { useProductStore } from '@/store/productStore';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/enhanced-button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { featuredProducts } = useProductStore();

  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection />
      
      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Products
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover our handpicked selection of premium electrical products
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="text-center">
              <Link to="/shop">
                <Button variant="store" size="lg">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
      
      <TestimonialsSection />
    </main>
  );
};

export default Home;