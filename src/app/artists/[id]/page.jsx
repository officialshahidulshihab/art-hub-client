import Image from "next/image";
import Link from "next/link";
import { getArtistById, getArtistArtworks } from "@/lib/data";
import ArtworkCard from "@/Components/ArtworkCard";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const artist = await getArtistById(id);
  if (!artist) return { title: "Artist Not Found" };
  return { title: artist.name };
}

const ArtistPage = async ({ params }) => {
  const { id } = await params;
  const artist = await getArtistById(id);
  if (!artist) return notFound();

  const artworks = await getArtistArtworks(id);
  const safeName = artist.name ?? "Artist";
  const userInitial = safeName[0].toUpperCase();

  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 py-14">
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            <div className="relative h-48 w-48 shrink-0 overflow-hidden bg-muted">
              {artist.avatar ? (
                <Image src={artist.avatar} alt={safeName} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary">
                  <span className="font-serif text-7xl text-muted-foreground">
                    {userInitial}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Artist
              </p>
              <h1 className="font-serif text-5xl text-foreground leading-tight">
                {safeName}
              </h1>
              <p className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground mt-2 mb-4">
                {artist.location}
              </p>
              <p className="font-sans text-sm text-muted-foreground max-w-lg leading-relaxed">
                {artist.bio}
              </p>

              <div className="flex items-center gap-10 mt-8">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Works</p>
                  <p className="font-serif text-2xl text-primary">{artist.worksCount ?? artworks.length}</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Sold</p>
                  <p className="font-serif text-2xl text-primary">{artist.worksSold}</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Lifetime</p>
                  <p className="font-serif text-2xl text-primary">{artist.lifetimeSales}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-14">
        <div className="flex items-end justify-between border-b border-border pb-4 mb-8">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Catalogue</p>
            <h2 className="font-serif text-3xl text-foreground">Works by {safeName}</h2>
          </div>
          <Link
            href={`/browse?artist=${id}`}
            className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-b border-muted-foreground pb-px"
          >
            Browse all
          </Link>
        </div>

        {artworks.length === 0 ? (
          <p className="font-sans text-sm text-muted-foreground">No works listed yet.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {artworks.map((artwork, ind) => (
              <ArtworkCard key={artwork._id || ind} artwork={artwork} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistPage;