import React, { useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import { useProductData } from '@/hooks/useProductData';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/enhanced-button';
import { ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { featuredProducts } = useProductStore();
  const { loading } = useProductData();

  return (
    <main className="min-h-screen">
      <HeroSection />
      
      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose IB Electric Store?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We provide the best electrical solutions with unmatched quality and service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="bg-gradient-to-br from-primary to-primary-glow rounded-xl p-8 text-white text-center hover-scale transition-all duration-300">
                <Zap className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Quality Products</h3>
                <p className="text-white/90">Premium electrical components for every need</p>
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-br from-secondary to-accent rounded-xl p-8 text-white text-center hover-scale transition-all duration-300">
                <Sparkles className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Fast Delivery</h3>
                <p className="text-white/90">Quick and reliable shipping across Pakistan</p>
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-br from-accent to-primary rounded-xl p-8 text-white text-center hover-scale transition-all duration-300">
                <ArrowRight className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Expert Support</h3>
                <p className="text-white/90">Professional guidance for all your electrical needs</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Featured Products
              </h2>
              <Sparkles className="h-8 w-8 text-primary ml-3" />
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our handpicked selection of premium electrical products
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-card rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <div key={product.id} className="animate-fade-in hover-scale">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Zap className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Featured Products Yet
              </h3>
              <p className="text-muted-foreground">
                Check back soon for our featured electrical products!
              </p>
            </div>
          )}
          
          <div className="text-center">
            <Link to="/shop">
              <Button variant="store" size="lg" className="hover-scale">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <TestimonialsSection />
    </main>
  );
};

export default Home;