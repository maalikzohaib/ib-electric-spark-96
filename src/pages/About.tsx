import { Card, CardContent } from "@/components/ui/card";
import { Shield, Clock, Award, Users } from "lucide-react";

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">About IB Electric Store</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted partner for quality electrical solutions since our establishment. 
            We specialize in providing premium fans and bulbs for homes and businesses.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                IB Electric Store was founded with a simple mission: to provide high-quality electrical 
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and help us serve our customers better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
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