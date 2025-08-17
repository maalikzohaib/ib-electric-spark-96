import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, ShoppingBag, Award } from "lucide-react";

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    sales: 0,
    customers: 0,
    products: 0,
    satisfaction: 0
  });

  const finalStats = {
    sales: 25000,
    customers: 1500,
    products: 200,
    satisfaction: 98
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;

      let step = 0;
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setAnimatedStats({
          sales: Math.floor(finalStats.sales * progress),
          customers: Math.floor(finalStats.customers * progress),
          products: Math.floor(finalStats.products * progress),
          satisfaction: Math.floor(finalStats.satisfaction * progress)
        });

        if (step >= steps) {
          clearInterval(interval);
          setAnimatedStats(finalStats);
        }
      }, stepTime);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const stats = [
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      label: "Monthly Sales",
      value: `Rs. ${animatedStats.sales.toLocaleString()}+`,
      suffix: ""
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      label: "Happy Customers",
      value: animatedStats.customers.toLocaleString(),
      suffix: "+"
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-primary" />,
      label: "Products Available",
      value: animatedStats.products.toLocaleString(),
      suffix: "+"
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      label: "Satisfaction Rate",
      value: animatedStats.satisfaction,
      suffix: "%"
    }
  ];

  return (
    <section id="stats-section" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our numbers speak for themselves - quality products and exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="text-center p-8 hover:shadow-elegant transition-all duration-500 animate-slide-up border-0 bg-background/60 backdrop-blur-sm"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="p-0">
                <div className="flex justify-center mb-4 animate-float">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <p className="text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;