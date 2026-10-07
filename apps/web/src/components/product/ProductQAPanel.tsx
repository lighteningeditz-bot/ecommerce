import React, { useState } from "react";
import { Sparkles, Send, HelpCircle, AlertCircle } from "lucide-react";
import { api } from "../../lib/api";
import { ProductQaOutput } from "@kalakart/shared";
import { Button } from "../ui/Button";

interface ProductQAPanelProps {
  productSlug: string;
}

export const ProductQAPanel: React.FC<ProductQAPanelProps> = ({ productSlug }) => {
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState<Array<{ question: string; response: ProductQaOutput }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (qText?: string) => {
    const textToAsk = (qText || question).trim();
    if (!textToAsk || textToAsk.length < 3) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await api.post<ProductQaOutput>("/ai/product-qa", {
        productSlug,
        question: textToAsk,
      });

      setQaHistory((prev) => [{ question: textToAsk, response }, ...prev]);
      setQuestion("");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to ask AI. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultSuggestions = [
    "What materials are used to make this?",
    "How do I care for and clean this craft?",
    "Is this safe for indoor plant use?",
  ];

  return (
    <div className="bg-gradient-to-br from-cream-100 via-white to-terracotta-50/40 rounded-3xl border border-terracotta-200/80 p-5 sm:p-6 shadow-sm my-8">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="p-2 rounded-xl bg-terracotta-600 text-white shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold font-display text-stone-900">
            Ask Kala AI About This Craft
          </h3>
          <p className="text-xs text-stone-500">
            Grounded answers strictly based on verified maker specifications and verified reviews.
          </p>
        </div>
      </div>

      {/* Suggested quick chips */}
      {qaHistory.length === 0 && (
        <div className="mt-4">
          <span className="text-xs font-semibold text-stone-600 mb-2 block">
            Suggested questions:
          </span>
          <div className="flex flex-wrap gap-2">
            {defaultSuggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSubmit(s)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full bg-white hover:bg-terracotta-50 text-stone-700 hover:text-terracotta-700 border border-stone-200 hover:border-terracotta-300 transition-colors text-left"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="mt-4 flex gap-2"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What are the exact dimensions? Can this be handwashed?"
          maxLength={300}
          className="flex-1 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-transparent"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          disabled={!question.trim() || question.trim().length < 3}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {errorMsg && (
        <div className="mt-3 text-xs text-red-600 flex items-center gap-1.5 bg-red-50 p-2.5 rounded-xl border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Q&A Response Thread */}
      {qaHistory.length > 0 && (
        <div className="mt-6 space-y-4 pt-4 border-t border-stone-200/60">
          {qaHistory.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm space-y-2">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs sm:text-sm font-semibold text-stone-800">{item.question}</p>
              </div>

              <div className="flex items-start gap-2 pl-4 border-l-2 border-terracotta-400">
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {item.response.answer}
                </p>
              </div>

              {/* Follow-up chips */}
              {item.response.follow_ups && item.response.follow_ups.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {item.response.follow_ups.map((fu, fIdx) => (
                    <button
                      key={fIdx}
                      type="button"
                      onClick={() => handleSubmit(fu)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-stone-100 hover:bg-terracotta-50 text-stone-600 hover:text-terracotta-700 transition-colors"
                    >
                      {fu}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
