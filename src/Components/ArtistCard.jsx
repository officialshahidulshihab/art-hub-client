import Image from "next/image";
import Link from "next/link";

const ArtistCard = ({ artist }) => {
  const { _id, name, avatar, location, bio, worksCount } = artist;
  const id = _id?.$oid || _id;
  const safeName = name ?? "Artist";
  const userInitial = safeName[0].toUpperCase();

  return (
    <Link href={`/artists/${id}`} className="group">
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {avatar ? (
          <Image
            src={avatar}
            alt={safeName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <span className="font-serif text-5xl text-muted-foreground">
              {userInitial}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="font-serif text-lg text-primary leading-snug">{safeName}</p>
        <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
          {location}
        </p>
        <p className="font-sans text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
          {bio}
        </p>
        <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mt-3">
          {worksCount} works
        </p>
      </div>
    </Link>
  );
};

export default ArtistCard;