import * as React from "react";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:border-foreground/30 focus:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
