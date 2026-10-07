import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, count, size = "sm" }) => {
  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const numRating = Number(rating) || 0;

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rating: ${numRating} out of 5 stars`}>
      <div className="flex items-center text-saffron-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              numRating >= star
                ? "fill-saffron-400 text-saffron-500"
                : numRating >= star - 0.5
                ? "fill-saffron-200 text-saffron-400"
                : "text-stone-300"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-stone-700">
        {numRating > 0 ? numRating.toFixed(1) : "New"}
      </span>
      {count !== undefined && count > 0 && (
        <span className="text-xs text-stone-400">({count})</span>
      )}
    </div>
  );
};
