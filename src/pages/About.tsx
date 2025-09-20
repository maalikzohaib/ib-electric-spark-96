import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Award, Users, Zap, Target, TrendingUp, Heart } from "lucide-react";
import realCeilingFan from "@/assets/real-ceiling-fan.jpg";
import realLedBulbs from "@/assets/real-led-bulbs.jpg";

const About = () => {
  const values = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Quality Assurance",
      description: "We source only the highest quality electrical products from trusted manufacturers, ensuring durability and performance."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Reliable Service",
      description: "Fast response times and efficient service delivery. We understand the importance of your electrical needs."
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Expert Knowledge",
      description: "Our team has years of experience in the electrical industry, providing expert advice and recommendations."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Customer Focus",
      description: "Customer satisfaction is our priority. We build lasting relationships through trust and quality service."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About Ijaz Brothers Electric Store</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted partner for quality electrical solutions since our establishment. 
            We specialize in providing premium fans and bulbs for homes and businesses.
          </p>
        </div>

        {/* Hero Image Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-slide-up">
          <Card className="overflow-hidden shadow-elegant">
            <div className="relative h-64">
              <img 
                src={realCeilingFan} 
                alt="Premium Ceiling Fans" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Premium Ceiling Fans</h3>
                  <p className="text-sm opacity-90">Energy-efficient designs for modern homes</p>
                </div>
              </div>
            </div>
          </Card>
          <Card className="overflow-hidden shadow-elegant">
            <div className="relative h-64">
              <img 
                src={realLedBulbs} 
                alt="LED Lighting Solutions" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">LED Lighting Solutions</h3>
                  <p className="text-sm opacity-90">Smart and sustainable lighting technology</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-scale-in">
          <Card className="text-center p-6 shadow-card hover:shadow-elegant transition-all duration-300">
            <div className="text-3xl font-bold text-primary mb-2">5+</div>
            <p className="text-muted-foreground text-sm">Years Experience</p>
          </Card>
          <Card className="text-center p-6 shadow-card hover:shadow-elegant transition-all duration-300">
            <div className="text-3xl font-bold text-primary mb-2">1000+</div>
            <p className="text-muted-foreground text-sm">Happy Customers</p>
          </Card>
          <Card className="text-center p-6 shadow-card hover:shadow-elegant transition-all duration-300">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <p className="text-muted-foreground text-sm">Product Varieties</p>
          </Card>
          <Card className="text-center p-6 shadow-card hover:shadow-elegant transition-all duration-300">
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <p className="text-muted-foreground text-sm">Satisfaction Rate</p>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 animate-fade-in">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Ijaz Brothers Electric Store was founded with a simple mission: to provide high-quality electrical 
                products at competitive prices with exceptional customer service. Over the years, we have 
                built a reputation as a reliable source for ceiling fans and LED bulbs in our community.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our commitment to quality and customer satisfaction has made us a preferred choice for 
                homeowners, contractors, and businesses looking for dependable electrical solutions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide our customers with energy-efficient, high-quality electrical products while 
                delivering exceptional service and building long-lasting relationships based on trust 
                and reliability.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">What We Offer</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Wide selection of ceiling fans from leading brands
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Energy-efficient LED bulbs in various wattages and colors
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Competitive pricing and value for money
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Expert advice and product recommendations
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Fast and reliable service
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Warranty support on all products
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to sustainability and energy efficiency. All our products are selected 
                with environmental considerations in mind, helping our customers reduce their energy 
                consumption while maintaining optimal performance.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These fundamental principles guide everything we do and help us serve our customers better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-elegant transition-all duration-300 animate-scale-in group" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <Card className="text-center hover:shadow-elegant transition-all duration-300 animate-scale-in group">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Innovation</h3>
                <p className="text-muted-foreground text-sm">
                  Embracing latest technology and innovative electrical solutions
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-elegant transition-all duration-300 animate-scale-in group">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Precision</h3>
                <p className="text-muted-foreground text-sm">
                  Accurate product specifications and precise installation guidance
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-elegant transition-all duration-300 animate-scale-in group">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Growth</h3>
                <p className="text-muted-foreground text-sm">
                  Continuous improvement and expanding our product range
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-elegant transition-all duration-300 animate-scale-in group">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Care</h3>
                <p className="text-muted-foreground text-sm">
                  Caring for our community and environmental sustainability
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-subtle rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contact us today to discuss your electrical needs. Our team is ready to help you find 
            the perfect solutions for your home or business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/923014539090"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
                Contact on WhatsApp
              </button>
            </a>
            <a
              href="mailto:info@ibelectricstore.com"
              className="inline-block"
            >
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Send Email
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
