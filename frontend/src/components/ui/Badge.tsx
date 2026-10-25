import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" | "teal" | "purple";
  withDot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  withDot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-blue-50/80 text-blue-700 border-blue-200/80 shadow-[0_1px_2px_rgba(59,130,246,0.06)]",
    secondary: "bg-slate-100 text-slate-700 border-slate-200/80",
    success: "bg-emerald-50/80 text-emerald-700 border-emerald-200/80 shadow-[0_1px_2px_rgba(16,185,129,0.06)]",
    warning: "bg-amber-50/80 text-amber-700 border-amber-200/80 shadow-[0_1px_2px_rgba(245,158,11,0.06)]",
    destructive: "bg-rose-50/80 text-rose-700 border-rose-200/80 shadow-[0_1px_2px_rgba(244,63,94,0.06)]",
    outline: "bg-white/80 text-slate-600 border-slate-200 shadow-xs",
    teal: "bg-teal-50/80 text-teal-700 border-teal-200/80 shadow-[0_1px_2px_rgba(20,184,166,0.06)]",
    purple: "bg-purple-50/80 text-purple-700 border-purple-200/80 shadow-[0_1px_2px_rgba(168,85,247,0.06)]",
  };

  const dotColors = {
    default: "bg-blue-500",
    secondary: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-rose-500",
    outline: "bg-slate-400",
    teal: "bg-teal-500",
    purple: "bg-purple-500",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {withDot && (
        <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
