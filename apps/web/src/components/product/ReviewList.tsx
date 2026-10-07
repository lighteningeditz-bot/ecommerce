import React from "react";
import { Review } from "@kalakart/shared";
import { RatingStars } from "../ui/RatingStars";
import { formatDate } from "../../lib/format";
import { ShieldCheck, User } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-stone-500 text-sm">
        No reviews yet for this craft. Be the first verified buyer to share your thoughts!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((rev) => (
        <div
          key={rev.id}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/70 shadow-sm"
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-xs font-bold">
                {rev.profile?.full_name?.charAt(0).toUpperCase() || <User className="w-4 h-4 text-stone-500" />}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-stone-900 leading-none">
                  {rev.profile?.full_name || "Verified Customer"}
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Purchase
                </span>
              </div>
            </div>

            <span className="text-[11px] text-stone-400">{formatDate(rev.created_at)}</span>
          </div>

          <div className="mb-2">
            <RatingStars rating={rev.rating} />
          </div>

          {rev.title && (
            <h5 className="text-sm font-semibold text-stone-900 mb-1">{rev.title}</h5>
          )}

          {rev.body && (
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{rev.body}</p>
          )}
        </div>
      ))}
    </div>
  );
};
