import Link from "next/link";
import Image from "next/image";
import { getTopArtists } from "@/lib/data";

const TopArtistsSection = async () => {
  const artists = await getTopArtists();

  if (!artists || artists.length === 0) return null;

  return (
    <section className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-16">
        <p className="text-primary font-sans text-[11px] uppercase tracking-widest mb-2">
          In the studio
        </p>
        <h2 className="font-serif text-4xl text-foreground mb-10">
          Top artists this month
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {artists.map((artist, i) => {
            const id = artist._id?.$oid || artist._id;
            return (
              <Link key={id} href={`/artists/${id}`} className="group">
                <div className="flex items-start gap-4 mb-4">
                  <span className="font-serif text-4xl text-muted leading-none shrink-0 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
                      <Image
                        src={artist.avatar}
                        alt={artist.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-serif text-base text-foreground group-hover:text-primary transition-colors">
                        {artist.name}
                      </p>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
                        {artist.location}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">
                  {artist.bio}
                </p>

                <p className="font-sans text-[10px] uppercase tracking-widest text-primary">
                  {artist.worksSold} works sold
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopArtistsSection;