"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import ArtistCard from "./ArtistCard";

const ArtistFilters = ({ artists }) => {
  const [query, setQuery] = useState("");

  const filtered = artists.filter((a) => {
    const q = query.toLowerCase();
    return (
      a.name?.toLowerCase().includes(q) ||
      a.location?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <div className="flex items-center justify-between border-b border-border pb-4 mb-10">
        <div className="flex items-center gap-2.5 flex-1">
          <FiSearch className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or city..."
            className="bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
          />
        </div>
        <p className="font-sans text-sm text-muted-foreground shrink-0 ml-6">
          {filtered.length}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="font-sans text-sm text-muted-foreground">
          No artists match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {filtered.map((artist, ind) => (
            <ArtistCard key={artist._id || ind} artist={artist} />
          ))}
        </div>
      )}
    </>
  );
};

export default ArtistFilters;