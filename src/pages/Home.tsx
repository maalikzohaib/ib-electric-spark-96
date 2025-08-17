import { Link } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent } from "@/components/ui/card";
import { useProductStore } from "@/store/productStore";
import ProductCard from "@/components/ProductCard";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SalesChart from "@/components/SalesChart";
import { Zap, Shield, Clock, Award, Lightbulb, Wind, Leaf, Users, ArrowRight } from "lucide-react";
import energyEfficiency from "@/assets/energy-efficiency.jpg";
import customerService from "@/assets/customer-service.jpg";

const Home = () => {
  const { getFeaturedProducts } = useProductStore();
  const featuredProducts = getFeaturedProducts();

  const features = [
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Energy Efficient",
      description: "High-quality electrical products designed for optimal energy consumption and performance.",
      color: "bg-primary/10"
    },
    {
      icon: <Shield className="h-10 w-10 text-accent" />,
      title: "Quality Guaranteed",
      description: "All our products come with manufacturer warranty and our commitment to quality.",
      color: "bg-accent/10"
    },
    {
      icon: <Clock className="h-10 w-10 text-success" />,
      title: "Fast Service",
      description: "Quick response time and efficient service for all your electrical needs.",
      color: "bg-success/10"
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: "Trusted Brand",
      description: "Years of experience serving the community with reliable electrical solutions.",
      color: "bg-primary/10"
    }
  ];

  const benefits = [
    {
      icon: <Lightbulb className="h-12 w-12 text-accent" />,
      title: "Smart Lighting Solutions",
      description: "LED technology that adapts to your lifestyle while saving up to 80% on electricity bills.",
      image: energyEfficiency
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Customer-Centric Service",
      description: "24/7 WhatsApp support and personalized product recommendations for your specific needs.",
      image: customerService
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our handpicked selection of top-quality electrical products, 
              carefully chosen for their performance and reliability
            </p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {featuredProducts.map((product, index) => (
                  <div key={product.id} style={{ animationDelay: `${index * 100}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              <div className="text-center animate-fade-in">
                <Link to="/shop">
                  <Button variant="outline" size="lg" className="hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    View More Products
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-8 text-lg">
                  No featured products available at the moment.
                </p>
                <Link to="/shop">
                  <Button variant="store" size="lg">
                    Browse All Products
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Smart Solutions for Modern Living
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Experience the perfect blend of technology, efficiency, and style with our premium electrical products
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="overflow-hidden border-0 shadow-elegant hover:shadow-xl transition-all duration-500 animate-slide-up group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                  <div className="relative overflow-hidden">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="mb-6">
                      {benefit.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose IB Electric Store?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We are committed to providing the best electrical solutions with exceptional service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center p-8 hover:shadow-elegant transition-all duration-500 animate-scale-in border-0 shadow-card group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-0">
                  <div className={`w-20 h-20 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-foreground mb-3 text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sales Chart Section */}
      <SalesChart />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Category Spotlight */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Our Product Categories
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our specialized collections designed for every electrical need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Link to="/shop?category=Fans" className="group animate-slide-up">
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 border-0 shadow-elegant">
                <div className="relative h-80 bg-gradient-primary flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-white/10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                  </div>
                  <div className="text-center text-primary-foreground relative z-10 transform group-hover:scale-105 transition-transform duration-300">
                    <Wind className="h-16 w-16 mx-auto mb-4 animate-float" />
                    <h3 className="text-3xl font-bold mb-3">Ceiling Fans</h3>
                    <p className="text-primary-foreground/90 text-lg">Energy-efficient and stylish ceiling fans</p>
                    <div className="mt-6 inline-flex items-center text-primary-foreground/80">
                      <span className="mr-2">Explore Collection</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
            
            <Link to="/shop?category=Bulbs" className="group animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 border-0 shadow-elegant">
                <div className="relative h-80 bg-gradient-accent flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-black/10 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                  </div>
                  <div className="text-center text-accent-foreground relative z-10 transform group-hover:scale-105 transition-transform duration-300">
                    <Lightbulb className="h-16 w-16 mx-auto mb-4 animate-float" style={{ animationDelay: '1s' }} />
                    <h3 className="text-3xl font-bold mb-3">LED Bulbs</h3>
                    <p className="text-accent-foreground/90 text-lg">Bright and long-lasting LED lighting solutions</p>
                    <div className="mt-6 inline-flex items-center text-accent-foreground/80">
                      <span className="mr-2">Explore Collection</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;