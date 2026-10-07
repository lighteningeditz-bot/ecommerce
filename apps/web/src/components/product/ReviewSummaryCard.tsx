import React from "react";
import { Sparkles, ThumbsUp, AlertTriangle } from "lucide-react";
import { ReviewSummaryOutput } from "@kalakart/shared";

interface ReviewSummaryCardProps {
  summary: ReviewSummaryOutput | null;
}

export const ReviewSummaryCard: React.FC<ReviewSummaryCardProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-2xl border border-amber-200/80 p-5 shadow-sm my-6">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold font-display text-stone-900">
            AI Customer Sentiment Summary
          </h4>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wider">
          {summary.sentiment}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
        {summary.overview}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {summary.pros && summary.pros.length > 0 && (
          <div className="bg-white/80 rounded-xl p-3 border border-emerald-100">
            <span className="font-bold text-emerald-800 flex items-center gap-1.5 mb-1.5">
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>What buyers loved</span>
            </span>
            <ul className="space-y-1 text-stone-600">
              {summary.pros.map((pro, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.cons && summary.cons.length > 0 && (
          <div className="bg-white/80 rounded-xl p-3 border border-amber-100">
            <span className="font-bold text-amber-800 flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Things to consider</span>
            </span>
            <ul className="space-y-1 text-stone-600">
              {summary.cons.map((con, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="text-[10px] text-stone-400 mt-3 italic text-right">
        Summarized by AI from verified customer purchase reviews.
      </p>
    </div>
  );
};
