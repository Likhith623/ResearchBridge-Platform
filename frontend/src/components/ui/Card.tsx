import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glass?: boolean;
}

export function Card({
  className,
  children,
  hoverable = false,
  glass = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "pastel-surface rounded-2xl border transition-all duration-300",
        glass
          ? "bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl border-slate-200/80 dark:border-white/20 text-slate-900 dark:text-slate-100 shadow-[0_8px_32px_0_rgba(148,163,184,0.12)] dark:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.8),0_0_12px_rgba(255,255,255,0.04)]"
          : "bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/80 dark:border-white/20 text-slate-900 dark:text-slate-100 shadow-[0_4px_24px_-4px_rgba(148,163,184,0.12)] dark:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.7),0_0_10px_rgba(255,255,255,0.04)]",
        hoverable &&
          "hover:border-indigo-500/50 hover:dark:border-white/35 hover:shadow-[0_12px_36px_-6px_rgba(99,102,241,0.2)] hover:dark:shadow-[0_20px_45px_-5px_rgba(0,0,0,0.9),0_0_15px_rgba(255,255,255,0.08)] hover:-translate-y-1 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 py-5 border-b border-slate-200/80 dark:border-white/10 flex flex-col gap-1.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-slate-600 dark:text-slate-400 leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 py-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}
