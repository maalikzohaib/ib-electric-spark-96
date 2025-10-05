import React from "react";
import { motion } from "motion/react";

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Array<{ text: string; image: string; name: string; role: string }>;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full bg-background" key={i}>
                  <div className="text-muted-foreground leading-relaxed">{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5 text-foreground">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight text-muted-foreground">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      text: "Excellent quality ceiling fans! The service was prompt and the products exceeded my expectations. Highly recommended for anyone looking for reliable electrical solutions.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
      name: "Ahmed Hassan",
      role: "Homeowner"
    },
    {
      text: "Ijaz Brothers Electric Store has the best LED bulbs in the market. Their energy-efficient solutions have helped me create amazing lighting designs for my clients.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
      name: "Fatima Khan",
      role: "Interior Designer"
    },
    {
      text: "Professional service and competitive prices. I've been buying electrical items from them for years. Their WhatsApp ordering system makes it so convenient.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammad",
      name: "Mohammad Ali",
      role: "Business Owner"
    },
    {
      text: "The quality of their electrical components is outstanding. I've used them for multiple construction projects and never been disappointed.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      name: "Sarah Ahmed",
      role: "Contractor"
    },
    {
      text: "Fast delivery and excellent customer support. They helped me choose the perfect lighting solution for my restaurant.",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Usman",
      name: "Usman Malik",
      role: "Restaurant Owner"
    },
    {
      text: "Best prices in town with top-notch quality. Their ceiling fans are elegant and durable. Very satisfied with my purchase!",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha",
      name: "Ayesha Siddiqui",
      role: "Homeowner"
    }
  ];

  // Split testimonials into 3 columns
  const firstColumn = testimonials.slice(0, 2);
  const secondColumn = testimonials.slice(2, 4);
  const thirdColumn = testimonials.slice(4, 6);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Don't just take our word for it - here's what our satisfied customers have to say
          </p>
        </div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} className="hidden md:block" />
          <TestimonialsColumn testimonials={secondColumn} duration={19} className="hidden lg:block" />
          <TestimonialsColumn testimonials={thirdColumn} duration={17} />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
