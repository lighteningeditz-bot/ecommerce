import React from "react";
import { Plus, Minus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  min = 1,
  max = 20,
  onChange,
  disabled = false,
}) => {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-stone-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="p-1.5 text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="w-8 text-center text-sm font-semibold text-stone-900 select-none">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="p-1.5 text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
