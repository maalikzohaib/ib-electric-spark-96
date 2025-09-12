import * as React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", variant = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-4 w-4 border-2",
      md: "h-6 w-6 border-2",
      lg: "h-8 w-8 border-3",
    };

    const variantClasses = {
      default: "border-t-foreground",
      primary: "border-t-primary",
    };

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        <div
          className={cn(
            "animate-spin rounded-full border-transparent",
            sizeClasses[size],
            variantClasses[variant]
          )}
        />
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };