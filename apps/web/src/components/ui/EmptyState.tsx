import React from "react";
import { PackageOpen } from "lucide-react";
import { Button } from "./Button";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-stone-200/60 shadow-sm max-w-md mx-auto my-8">
      <div className="p-4 bg-terracotta-50 text-terracotta-600 rounded-full mb-4">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-stone-900 mb-1">{title}</h3>
      <p className="text-sm text-stone-500 mb-6 max-w-xs">{description}</p>

      {actionText && actionHref && (
        <Link to={actionHref}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      )}

      {actionText && onAction && !actionHref && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
