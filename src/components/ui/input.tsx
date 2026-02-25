import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-textPrimary placeholder:text-textSecondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40",
        className
      )}
      {...props}
    />
  );
}
