import { Suspense } from "react";
import { getAllArtists } from "@/lib/data";
import ArtistFilters from "@/Components/ArtistFilters";

export const metadata = { title: "Artists — ArtHub" };

const AllArtist = async () => {
  const artists = await getAllArtists();

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 py-14">
          <p className="font-sans text-[11px] uppercase tracking-widest text-primary mb-3">
            Directory
          </p>
          <h1 className="font-serif text-5xl text-foreground">
            Every artist on ArtHub
          </h1>
          <p className="font-sans text-sm text-muted-foreground mt-4 max-w-md leading-relaxed">
            <span className="text-primary">Established names</span> and brand-new studios. When an{" "}
            <span className="text-primary">artist joins</span> the platform, they
            appear here automatically.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-12">
        <Suspense
          fallback={
            <p className="font-sans text-sm text-muted-foreground">Loading...</p>
          }
        >
          <ArtistFilters artists={artists} />
        </Suspense>
      </div>
    </div>
  );
};

export default AllArtist;