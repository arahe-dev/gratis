import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-foreground/30 focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
