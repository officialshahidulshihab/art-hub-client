import Link from "next/link";
import ArtworkCard from "@/Components/ArtworkCard";
import { getFeaturedArtworks } from "@/lib/data";
import { FiArrowUpRight } from "react-icons/fi";

const FeaturedSection = async () => {
  const artworks = await getFeaturedArtworks();

  if (!artworks || artworks.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 lg:px-0 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-primary font-sans text-[11px] uppercase tracking-widest mb-2">
            Featured
          </p>
          <h2 className="font-serif text-4xl text-foreground leading-tight">
            This week in the gallery
          </h2>
        </div>
        <Link
          href="/browse"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors font-sans"
        >
          See all <FiArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork, ind) => (
          <ArtworkCard key={artwork._id || ind} artwork={artwork} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;