"use client";

import { Zap, Shield, Truck, Award, Headphones } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function WhyChooseUsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Us?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We provide the best electrical solutions with unmatched quality and service
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <GridItem
            area="md:col-span-1"
            icon={<Zap className="h-5 w-5" />}
            title="Energy Efficient"
            description="Premium electrical products designed to save energy and reduce your electricity bills."
          />
          <GridItem
            area="md:col-span-1"
            icon={<Shield className="h-5 w-5" />}
            title="Quality Guaranteed"
            description="All our products come with manufacturer warranties and quality certifications."
          />
          <GridItem
            area="md:col-span-1"
            icon={<Truck className="h-5 w-5" />}
            title="Fast Delivery"
            description="Quick and reliable shipping across Pakistan. Get your products delivered on time."
          />
          <GridItem
            area="md:col-span-1 lg:col-span-1"
            icon={<Award className="h-5 w-5" />}
            title="Trusted Brand"
            description="Trusted by over 1500+ customers for quality electrical solutions since years."
          />
          <GridItem
            area="md:col-span-1 lg:col-span-2"
            icon={<Headphones className="h-5 w-5" />}
            title="Expert Support"
            description="Professional guidance and after-sales support for all your electrical needs. Our team is always ready to help."
          />
        </ul>
      </div>
    </section>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-primary/10 p-2.5">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <p className="font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
