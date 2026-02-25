import { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-textPrimary placeholder:text-textSecondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40",
        className
      )}
      {...props}
    />
  );
}
