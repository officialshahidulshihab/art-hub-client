"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CATEGORIES = [
  "All works",
  "Painting",
  "Digital",
  "Sculpture",
  "Photography",
  "Illustration",
  "Mixed Media",
];

const BrowseFilters = ({ artworks }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "All works";
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");

  const buildUrl = (category, min, max) => {
    const params = new URLSearchParams();
    if (category && category !== "All works") params.set("category", category);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    return `/browse${params.toString() ? `?${params.toString()}` : ""}`;
  };

  const handleCategory = (cat) =>
    router.push(buildUrl(cat, minPrice, maxPrice));
  const handlePriceApply = () =>
    router.push(buildUrl(activeCategory, minPrice, maxPrice));
  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    router.push("/browse");
  };

  const filtered = artworks.filter((a) => {
    const catMatch =
      activeCategory === "All works" || a.category === activeCategory;
    const minMatch = minPrice === "" || a.price >= Number(minPrice);
    const maxMatch = maxPrice === "" || a.price <= Number(maxPrice);
    return catMatch && minMatch && maxMatch;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-10">
   
      <aside className="w-full lg:w-48 shrink-0">
        <p className="font-sans text-[10px] uppercase tracking-widest text-primary mb-3">
          Category
        </p>
        <ul className="space-y-2 mb-8">
          {CATEGORIES.map((cat, ind) => (
            <li key={ind}>
              <button
                onClick={() => handleCategory(cat)}
                className={`font-sans text-sm text-left w-full transition-colors ${
                  activeCategory === cat
                    ? "text-primary font-medium"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>

        <p className="font-sans text-[10px] uppercase tracking-widest text-primary mb-3">
          Price (USD)
        </p>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-border bg-background text-foreground font-sans text-sm px-3 py-2 focus:outline-none focus:border-foreground"
          />
          <span className="text-muted-foreground font-sans text-sm shrink-0">
            —
          </span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-border bg-background text-foreground font-sans text-sm px-3 py-2 focus:outline-none focus:border-foreground"
          />
        </div>
        <button
          onClick={handlePriceApply}
          className="w-full border border-border font-sans text-[11px] uppercase tracking-widest text-foreground px-3 py-2 hover:bg-secondary transition-colors mb-4"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          × Reset filters
        </button>
      </aside>

     
      <div className="flex-1">
        {filtered.length === 0 ? (
          <p className="font-sans text-sm text-muted-foreground mt-4">
            No artworks match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((artwork, ind) => {
              const id = artwork._id?.$oid || artwork._id;
              return (
                <Link key={id || ind} href={`/artworks/${id}`} className="group">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <p className="font-serif italic text-base text-foreground leading-snug">
                      {artwork.title}
                    </p>
                    <p className="font-sans text-sm text-foreground shrink-0">
                      ${artwork.price?.toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-1 font-sans text-[10px] uppercase tracking-widest text-muted-foreground truncate">
                    {artwork.artistName} · {artwork.category}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseFilters;
