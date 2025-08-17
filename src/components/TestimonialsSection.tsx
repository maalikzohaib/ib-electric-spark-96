import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "Homeowner",
      avatar: "AH",
      rating: 5,
      content: "Excellent quality ceiling fans! The service was prompt and the products exceeded my expectations. Highly recommended for anyone looking for reliable electrical solutions."
    },
    {
      name: "Fatima Khan",
      role: "Interior Designer",
      avatar: "FK",
      rating: 5,
      content: "IB Electric Store has the best LED bulbs in the market. Their energy-efficient solutions have helped me create amazing lighting designs for my clients."
    },
    {
      name: "Mohammad Ali",
      role: "Business Owner",
      avatar: "MA",
      rating: 5,
      content: "Professional service and competitive prices. I've been buying electrical items from them for years. Their WhatsApp ordering system makes it so convenient."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it - here's what our satisfied customers have to say
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="relative p-6 hover:shadow-elegant transition-all duration-500 animate-scale-in border-0 bg-background shadow-card"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-0">
                <div className="absolute -top-2 -left-2">
                  <Quote className="h-8 w-8 text-accent opacity-60" />
                </div>
                
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;