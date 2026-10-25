import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "teal" | "glass";
  size?: "xs" | "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]";

  const sizeStyles = {
    xs: "text-[11px] px-2.5 py-1 gap-1 rounded-lg",
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-xs font-semibold px-4 py-2 gap-2 shadow-xs",
    lg: "text-sm font-semibold px-5 py-2.5 gap-2.5 shadow-sm",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 focus:ring-blue-500 border border-blue-500/30",
    secondary:
      "bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 text-slate-800 border border-slate-200/60 focus:ring-slate-400",
    outline:
      "border border-slate-200 bg-white/80 hover:bg-slate-50 hover:border-slate-300 text-slate-700 shadow-xs focus:ring-slate-400",
    ghost:
      "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 focus:ring-slate-400",
    destructive:
      "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-500/20 focus:ring-rose-500 border border-rose-500/30",
    teal:
      "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30 focus:ring-teal-500 border border-teal-500/30",
    glass:
      "bg-white/10 hover:bg-white/20 active:bg-white/25 text-white backdrop-blur-md border border-white/20 shadow-sm focus:ring-white/50",
  };

  return (
    <button
      className={cn(base, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
