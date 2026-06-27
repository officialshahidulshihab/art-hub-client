import BuyButton from "@/Components/Buybutton";
import ArtworkComments from "@/Components/ArtworkComments";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";


const getArtwork = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/artworks/${id}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  return res.json();
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const artwork = await getArtwork(id);
  if (!artwork) return { title: "Artwork Not Found" };
  return { title: `${artwork.title} — ArtHub` };
}

const ArtworkPage = async ({ params }) => {
  const { id } = await params;
  const artwork = await getArtwork(id);
  if (!artwork) return notFound();

  const artworkId = artwork._id?.$oid || artwork._id;

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="lg:sticky lg:top-24">
            <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              {artwork.category}
            </p>
            <h1 className="font-serif text-5xl text-foreground leading-tight italic">
              {artwork.title}
            </h1>
            <p className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground mt-2 mb-6">
              <Link
                href={`/artists/${artwork.artistId}`}
                className="hover:text-primary transition-colors"
              >
                {artwork.artistName}
              </Link>
            </p>

            {artwork.description && (
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
                {artwork.description}
              </p>
            )}

            <div className="border-t border-b border-border py-6 mb-8">
              <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                Price
              </p>
              <p className="font-serif text-4xl text-foreground">
                ${artwork.price?.toLocaleString()}
              </p>
            </div>

            <BuyButton artwork={{ ...artwork, id: artworkId }} />

            <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mt-4 text-center">
              Original artwork · Secure checkout
            </p>

            <div className="mt-8 flex items-start gap-10 border-t border-border pt-6">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                  Medium
                </p>
                <p className="font-sans text-sm text-foreground">
                  {artwork.medium || artwork.category}
                </p>
              </div>
              {artwork.dimensions && (
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Dimensions
                  </p>
                  <p className="font-sans text-sm text-foreground">
                    {artwork.dimensions}
                  </p>
                </div>
              )}
              {artwork.year && (
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Year
                  </p>
                  <p className="font-sans text-sm text-foreground">
                    {artwork.year}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

          <ArtworkComments artworkId={artworkId} />
      </div>
      
      
    </div>
  );
};

export default ArtworkPage;