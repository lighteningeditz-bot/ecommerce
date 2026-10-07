import React from "react";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger" | "craft";
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = "default", children, className = "" }) => {
  const variantStyles = {
    default: "bg-stone-100 text-stone-700 border-stone-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    craft: "bg-terracotta-50 text-terracotta-700 border-terracotta-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
