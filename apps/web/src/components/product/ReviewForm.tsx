import React, { useState } from "react";
import { Star } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { Button } from "../ui/Button";

interface ReviewFormProps {
  productSlug: string;
  onReviewSubmitted: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productSlug, onReviewSubmitted }) => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    return (
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-center my-6">
        <p className="text-sm text-stone-700 mb-2 font-medium">
          Have you purchased and received this handmade craft?
        </p>
        <p className="text-xs text-stone-500 mb-4">
          Please log in to your customer account to leave a verified review.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post(`/products/${productSlug}/reviews`, {
        rating,
        title: title.trim() || undefined,
        body: body.trim() || undefined,
      });

      success("Thank you! Your verified review has been published.");
      setTitle("");
      setBody("");
      onReviewSubmitted();
    } catch (err: any) {
      toastError("Review not submitted", err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-sm space-y-4 my-6"
    >
      <h4 className="text-base font-bold font-display text-stone-900">
        Write a Verified Customer Review
      </h4>

      {/* Star Selector */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1.5">Your Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 text-saffron-400 focus:outline-none transition-transform hover:scale-110"
              aria-label={`Select ${star} stars`}
            >
              <Star
                className={`w-6 h-6 ${
                  (hoverRating || rating) >= star
                    ? "fill-saffron-400 text-saffron-500"
                    : "text-stone-300"
                }`}
              />
            </button>
          ))}
          <span className="text-xs font-bold text-stone-700 ml-2">
            {rating} of 5 Stars
          </span>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          Review Headline (optional)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Exquisite terracotta craft! Beautiful earthy feel"
          maxLength={100}
          className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          Your Experience (optional)
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tell other craft lovers about the texture, finish, packaging, and handmade appeal..."
          rows={3}
          maxLength={1000}
          className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 focus:ring-2 focus:ring-terracotta-500 focus:outline-none"
        />
      </div>

      <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
        Submit Verified Review
      </Button>
    </form>
  );
};
