import { Suspense } from "react";
import BrowseFilters from "@/Components/BrowseFilters";
import { getAllArtworks } from "@/lib/data";

export const metadata = { title: "Browse Artworks" };

const BrowsePage = async () => {
  const artworks = await getAllArtworks();

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 py-10">
          <p className="font-sans text-[11px] uppercase tracking-widest text-primary mb-2">Gallery</p>
          <h1 className="font-serif text-4xl text-foreground">Browse artworks</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-10">
        <Suspense fallback={<p className="font-sans text-sm text-muted-foreground">Loading...</p>}>
          <BrowseFilters artworks={artworks} />
        </Suspense>
      </div>
    </div>
  );
};

export default BrowsePage;