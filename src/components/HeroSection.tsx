import { Link } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { ArrowRight, Zap, Star } from "lucide-react";
import heroFan from "@/assets/hero-fan.jpg";
import heroBulbs from "@/assets/hero-bulbs.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-subtle overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px]"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="flex items-center space-x-2 animate-fade-in">
              <Star className="h-5 w-5 text-accent fill-accent" />
              <span className="text-muted-foreground font-medium">Trusted by 1500+ customers</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                Premium
                <span className="text-primary block">Electrical</span>
                <span className="text-accent">Solutions</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Discover our extensive collection of energy-efficient ceiling fans and LED bulbs. 
                Quality products, competitive prices, and exceptional service.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-accent" />
                <span className="text-muted-foreground">Energy Efficient</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-accent" />
                <span className="text-muted-foreground">Quality Guaranteed</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/shop">
                <Button 
                  variant="store" 
                  size="lg" 
                  className="w-full sm:w-auto group hover:shadow-button transition-all duration-300"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="relative lg:ml-12">
            <div className="grid grid-cols-2 gap-6 animate-scale-in">
              
              {/* Fan Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <img
                  src={heroFan}
                  alt="Premium Ceiling Fan"
                  className="w-full h-64 object-cover rounded-2xl shadow-elegant hover:shadow-xl transition-all duration-500 transform group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
                    <h3 className="font-semibold text-foreground text-sm">Ceiling Fans</h3>
                    <p className="text-muted-foreground text-xs">Energy Efficient</p>
                  </div>
                </div>
              </div>

              {/* Bulbs Image */}
              <div className="relative group mt-8">
                <div className="absolute inset-0 bg-gradient-accent rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <img
                  src={heroBulbs}
                  alt="LED Bulbs Collection"
                  className="w-full h-64 object-cover rounded-2xl shadow-elegant hover:shadow-xl transition-all duration-500 transform group-hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
                    <h3 className="font-semibold text-foreground text-sm">LED Bulbs</h3>
                    <p className="text-muted-foreground text-xs">Long Lasting</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/20 rounded-full animate-float"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;