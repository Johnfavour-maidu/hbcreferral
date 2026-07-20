import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: "bg-gold text-white hover:bg-gold-dark shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30",
        gold: "bg-gold text-white hover:bg-gold-dark shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30",
        brown: "bg-brown text-cream hover:bg-brown-light shadow-lg shadow-brown/20",
        outline: "border-2 border-brown/20 text-brown hover:bg-brown hover:text-white hover:border-brown",
        ghost: "text-brown hover:bg-cream-dark",
        link: "text-gold underline-offset-4 hover:underline",
        destructive: "bg-error text-white hover:bg-red-700 shadow-lg shadow-error/20",
        success: "bg-success text-white hover:bg-green-700",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
