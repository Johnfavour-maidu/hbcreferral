import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

export const AuthButton = forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ children, isLoading, loadingText, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className="w-full h-[50px] rounded-xl text-[15px] font-semibold shadow-[0_2px_8px_rgba(200,154,43,0.2)] hover:shadow-[0_4px_16px_rgba(200,154,43,0.3)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200"
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-[18px] w-[18px] animate-spin" />
            {loadingText || "Loading..."}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

AuthButton.displayName = "AuthButton";
