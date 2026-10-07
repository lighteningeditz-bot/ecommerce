import React, { useState } from "react";
import { ProductImage } from "@kalakart/shared";

interface ImageGalleryProps {
  images?: ProductImage[];
  productTitle: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images = [], productTitle }) => {
  const displayImages =
    images.length > 0
      ? images
      : [{ id: "fallback-1", url: "https://picsum.photos/seed/craft/800/800", alt_text: productTitle, sort_order: 1 }];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = displayImages[activeIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-sm">
        <img
          src={activeImage?.url}
          alt={activeImage?.alt_text || productTitle}
          className="w-full h-full object-cover object-center transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? "border-terracotta-600 shadow-sm ring-1 ring-terracotta-400"
                  : "border-stone-200 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={img.alt_text || `Angle ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
