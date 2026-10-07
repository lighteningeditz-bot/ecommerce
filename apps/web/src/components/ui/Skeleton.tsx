import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return <div className={`animate-pulse bg-stone-200 rounded-lg ${className}`} />;
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-3 border border-stone-100 shadow-sm flex flex-col gap-3">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};
