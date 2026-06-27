"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ArtworkCard = ({ artwork }) => {
  const { _id, title, price, artistName, artistId, category, image } = artwork;
  const id = _id?.$oid || _id;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Link href={`/artworks/${id}`}>
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div className="mt-3 flex items-start justify-between gap-2">
          <p className="font-serif italic text-lg text-foreground leading-snug">
            {title}
          </p>
          <p className="text-sm text-foreground font-sans shrink-0">
            ${price?.toLocaleString()}
          </p>
        </div>
      </Link>

      <p className="mt-1 font-sans text-[11px] uppercase tracking-widest">
        <Link href={`/artists/${artistId}`} className="text-primary hover:underline">
          {artistName}
        </Link>
        <span className="text-muted-foreground"> · </span>
        <span className="text-muted-foreground">{category}</span>
      </p>
    </motion.div>
  );
};

export default ArtworkCard;