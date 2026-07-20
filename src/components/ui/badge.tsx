import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-purple/20 bg-purple/10 text-purple",
        gold: "border-gold/20 bg-gold/10 text-gold-dark",
        success: "border-green-200 bg-green-50 text-green-700",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-700",
        danger: "border-red-200 bg-red-50 text-red-700",
        chocolate: "border-chocolate/20 bg-chocolate/10 text-chocolate",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
