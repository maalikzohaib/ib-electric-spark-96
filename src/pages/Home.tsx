import { Link } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent } from "@/components/ui/card";
import { useProductStore } from "@/store/productStore";
import ProductCard from "@/components/ProductCard";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SalesChart from "@/components/SalesChart";
import { Zap, Shield, Clock, Award, Lightbulb, Wind, Leaf, Users, ArrowRight, MessageCircle } from "lucide-react";
import smartHomeElectrical from "@/assets/smart-home-electrical.jpg";
import electricalComponents from "@/assets/electrical-components.jpg";
const Home = () => {
  const {
    getFeaturedProducts
  } = useProductStore();
  const featuredProducts = getFeaturedProducts();
  const features = [{
    icon: <Zap className="h-10 w-10 text-primary" />,
    title: "Energy Efficient",
    description: "High-quality electrical products designed for optimal energy consumption and performance.",
    color: "bg-primary/10"
  }, {
    icon: <Shield className="h-10 w-10 text-accent" />,
    title: "Quality Guaranteed",
    description: "All our products come with manufacturer warranty and our commitment to quality.",
    color: "bg-accent/10"
  }, {
    icon: <Clock className="h-10 w-10 text-success" />,
    title: "Fast Service",
    description: "Quick response time and efficient service for all your electrical needs.",
    color: "bg-success/10"
  }, {
    icon: <Award className="h-10 w-10 text-primary" />,
    title: "Trusted Brand",
    description: "Years of experience serving the community with reliable electrical solutions.",
    color: "bg-primary/10"
  }];
  const benefits = [{
    icon: <Lightbulb className="h-12 w-12 text-accent" />,
    title: "Smart Electrical Solutions",
    description: "Advanced LED technology and energy-efficient ceiling fans that adapt to your lifestyle while saving up to 80% on electricity bills.",
    image: smartHomeElectrical
  }, {
    icon: <Users className="h-12 w-12 text-primary" />,
    title: "Professional Grade Components",
    description: "High-quality electrical components, reliable wiring solutions, and premium electrical accessories for lasting performance.",
    image: electricalComponents
  }];
  return <>
      <title>IB Electric Store - Premium Ceiling Fans & LED Bulbs | Energy Efficient Electrical Products</title>
      <meta name="description" content="Shop premium ceiling fans and LED bulbs at IB Electric Store. Energy-efficient electrical products with 98% reliability, 32% power savings. Fast delivery in Pakistan." />
      <meta name="keywords" content="ceiling fans, LED bulbs, electrical products, energy efficient, Pakistan, IB Electric Store, electrical store, fans, bulbs, lighting" />
      
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
          
          {featuredProducts.length > 0 ? <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {featuredProducts.map((product, index) => <div key={product.id} style={{
                animationDelay: `${index * 100}ms`
              }}>
                    <ProductCard product={product} />
                  </div>)}
              </div>
              <div className="text-center animate-fade-in">
                <Link to="/shop">
                  <Button variant="store" size="lg" className="text-lg px-8 py-4 shadow-elegant hover:shadow-xl transition-all duration-300 animate-pulse">
                    🛒 Shop All Products - Best Deals Available!
                  </Button>
                </Link>
              </div>
            </> : <div className="text-center py-16 animate-fade-in">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-8 text-lg">
                  No featured products available at the moment.
                </p>
                <Link to="/shop">
                  <Button variant="store" size="lg" className="text-lg px-8 py-4 shadow-elegant hover:shadow-xl transition-all duration-300">Shop All Products Now!</Button>
                </Link>
              </div>
            </div>}
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
            {benefits.map((benefit, index) => <Card key={index} className="overflow-hidden border-0 shadow-elegant hover:shadow-xl transition-all duration-500 animate-slide-up group" style={{
              animationDelay: `${index * 200}ms`
            }}>
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                  <div className="relative overflow-hidden">
                    <img src={benefit.image} alt={benefit.title} className="w-full h-64 md:h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
              </Card>)}
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
            {features.map((feature, index) => <Card key={index} className="text-center p-8 hover:shadow-elegant transition-all duration-500 animate-scale-in border-0 shadow-card group" style={{
              animationDelay: `${index * 100}ms`
            }}>
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
              </Card>)}
          </div>
        </div>
      </section>

      {/* Sales Chart Section */}
      <SalesChart />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* WhatsApp Contact Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-bounce">
        <a href="https://wa.me/923014539090?text=Hello! I'm interested in your electrical products." target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 group">
          <MessageCircle className="h-6 w-6" />
          <span className="hidden md:block font-medium">Contact Us</span>
        </a>
      </div>
    </div>
    </>;
};
export default Home;