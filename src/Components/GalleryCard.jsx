import Image from "next/image";
import Link from "next/link";

const GalleryCard = ({ item }) => {
  const { id: itemId, image, name, price, artist, artistId, category } = item;

  return (
    <div className="group">
      <Link href={`/artworks/${itemId}`}>
        <div className="relative aspect-[3/4] w-full overflow-hidden border border-border bg-muted">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <p className="font-serif italic text-base text-foreground leading-snug">{name}</p>
        <p className="font-sans text-sm text-foreground shrink-0">${price.toLocaleString()}</p>
      </div>
      <p className="mt-1 font-sans text-[10px] uppercase tracking-widest">
        <Link
          href={`/artists/${artistId}`}
          className="text-primary hover:text-foreground transition-colors"
        >
          {artist}
        </Link>
        <span className="text-muted-foreground"> · </span>
        <span className="text-muted-foreground">{category}</span>
      </p>
    </div>
  );
};

export default GalleryCard;