import React from "react";
import { Link } from "react-router-dom";
import { SEEDED_CATEGORIES } from "@kalakart/shared";
import { formatINR } from "../../lib/format";

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-stone-900">
            Handmade Craft Traditions
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Curated artisanal crafts made using ancestral sustainable techniques
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6">
        {SEEDED_CATEGORIES.map((cat) => {
          const imageSrc = `https://picsum.photos/seed/cat-${cat.slug}/800/800`;

          return (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-200/60 shadow-sm aspect-[4/3] flex flex-col justify-end p-4 transition-all duration-300 hover:shadow-xl"
            >
              {/* Image with dark gradient overlay */}
              <img
                src={imageSrc}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-75 group-hover:opacity-65"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              <div className="relative z-10">
                <span className="inline-block text-[11px] font-bold text-saffron-300 mb-1">
                  From {formatINR(cat.minPrice)}
                </span>
                <h3 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-saffron-300 transition-colors leading-snug">
                  {cat.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
