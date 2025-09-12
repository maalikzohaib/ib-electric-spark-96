import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail, MapPin, Clock, Phone, Headphones, Award, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import electricalComponents from "@/assets/electrical-components.jpg";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create WhatsApp message with form data
    const whatsappMessage = `New Contact Form Submission:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject}

Message:
${formData.message}`;

    const whatsappUrl = `https://wa.me/923014539090?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });

    toast({
      title: "Message Sent!",
      description: "Your message has been forwarded to WhatsApp. We'll get back to you soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with us for any questions about our products or services. 
            We're here to help you find the perfect electrical solutions.
          </p>
        </div>

        {/* Hero Section */}
        <div className="mb-16 animate-slide-up">
          <Card className="overflow-hidden shadow-elegant">
            <div className="relative h-48 md:h-64">
              <img 
                src={electricalComponents} 
                alt="Professional Electrical Services" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60 flex items-center">
                <div className="container mx-auto px-6 text-white">
                  <div className="max-w-2xl">
                    <h2 className="text-3xl font-bold mb-4">Professional Electrical Support</h2>
                    <p className="text-lg opacity-90">
                      Expert guidance, quality products, and exceptional customer service for all your electrical needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Support Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-16 animate-scale-in">
          <Card className="text-center p-6 shadow-card hover:shadow-elegant transition-all duration-300 group">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-bold text-foreground mb-2">24/7 WhatsApp Support</h3>
            <p className="text-muted-foreground text-sm">Instant messaging support for quick queries</p>
          </Card>
          <Card className="text-center p-6 shadow-card hover:shadow-elegant transition-all duration-300 group">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Headphones className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Expert Consultation</h3>
            <p className="text-muted-foreground text-sm">Professional advice from electrical experts</p>
          </Card>
          <Card className="text-center p-6 shadow-card hover:shadow-elegant transition-all duration-300 group">
            <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Award className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Quality Assurance</h3>
            <p className="text-muted-foreground text-sm">Guaranteed quality and warranty support</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="space-y-4">
              {/* WhatsApp */}
              <Card className="hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="flex items-center p-6">
                  <div className="bg-green-100 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">WhatsApp - Instant Support</h3>
                    <a 
                      href="https://wa.me/923014539090" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors block"
                    >
                      +92 301 4539090
                    </a>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-xs text-muted-foreground ml-2">Fast Response</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="flex items-center p-6">
                  <div className="bg-primary/10 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Email Support</h3>
                    <a 
                      href="mailto:info@ibelectricstore.com"
                      className="text-muted-foreground hover:text-primary transition-colors block"
                    >
                      info@ibelectricstore.com
                    </a>
                    <span className="text-xs text-muted-foreground">Response within 24 hours</span>
                  </div>
                </CardContent>
              </Card>

              {/* Phone */}
              <Card className="hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="flex items-center p-6">
                  <div className="bg-accent/10 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Direct Call</h3>
                    <a 
                      href="tel:+923014539090"
                      className="text-muted-foreground hover:text-primary transition-colors block"
                    >
                      +92 301 4539090
                    </a>
                    <span className="text-xs text-muted-foreground">Call for immediate assistance</span>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="flex items-center p-6">
                  <div className="bg-primary/10 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Visit Our Store</h3>
                    <a 
                      href="https://maps.google.com/maps?q=Ijaz+Brother+Electric+Store"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors block"
                    >
                      Ijaz Brother Electric Store
                    </a>
                    <span className="text-xs text-muted-foreground">Click for directions</span>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="hover:shadow-elegant transition-all duration-300 group">
                <CardContent className="flex items-center p-6">
                  <div className="bg-primary/10 p-3 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">Business Hours</h3>
                    <div className="text-muted-foreground text-sm">
                      <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
                      <p>Sunday: 10:00 AM - 6:00 PM</p>
                    </div>
                    <span className="text-xs text-success">Open now</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="shadow-elegant animate-fade-in">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Product inquiry, support, etc."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your requirements or questions..."
                  />
                </div>

                <Button type="submit" variant="store" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Find Us</h2>
          <Card className="shadow-elegant">
            <CardContent className="p-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.6456123456789!2d74.4298427!3d31.46915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391909005afcd391%3A0x901e6a1c1d274e6d!2sIjaz%20Brother%20Electric%20Store!5e0!3m2!1sen-GB!2s!4v1234567890123"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              ></iframe>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;