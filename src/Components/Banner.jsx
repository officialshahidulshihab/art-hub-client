"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const AUTOPLAY_MS = 6000;

const Banner = ({ slides }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!slides || slides.length < 2) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const slide = slides[active];

  return (
    <div className="bg-background">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 lg:px-0 pt-16 pb-16 items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="text-primary font-sans text-[12px] tracking-widest uppercase">
              {slide.eyebrow}
            </p>

            <h1 className="text-foreground font-serif text-4xl lg:text-5xl leading-tight mt-4">
              {slide.titleLine1}{" "}
              {slide.titleAccent && (
                <span className="text-primary italic">{slide.titleAccent}</span>
              )}
            </h1>

            <p className="text-muted-foreground font-sans mt-5 max-w-md">
              {slide.subtitle}
            </p>

            <div className="flex items-center gap-3 mt-8">
              <Link href={slide.ctaLink || "/browse"}>
                <Button className="flex items-center gap-2 bg-foreground text-background font-sans">
                  <span>{slide.ctaText || "Browse artworks"}</span>
                  <FaArrowRight />
                </Button>
              </Link>
              <Link href={slide.secondaryLink || "/signup"}>
                <Button className="bg-background text-foreground border border-border font-sans">
                  {slide.secondaryText || "Open a studio"}
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 && (
          <div className="flex items-center gap-3 mt-10 lg:hidden">
            {slides.map((_, ind) => (
              <button
                key={ind}
                onClick={() => setActive(ind)}
                aria-label={`Go to slide ${ind + 1}`}
                className={`h-[2px] transition-all ${
                  ind === active ? "w-8 bg-foreground" : "w-4 bg-border"
                }`}
              />
            ))}
            <span className="ml-2 text-muted-foreground font-sans text-[12px]">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        )}

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative aspect-[4/5] w-full overflow-hidden"
            >
              <Image
                src={slide.image}
                alt={slide.titleLine1 || "Featured artwork"}
                fill
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {slide.collectedBy && (
            <div className="absolute -bottom-5 left-5 bg-card border border-border px-5 py-3">
              <p className="text-muted-foreground font-sans text-[10px] tracking-widest uppercase">
                Collected by
              </p>
              <p className="text-foreground font-serif text-lg">
                {slide.collectedBy}
              </p>
            </div>
          )}

          {slides.length > 1 && (
            <div className="hidden lg:flex items-center gap-3 mt-8">
              {slides.map((_, ind) => (
                <button
                  key={ind}
                  onClick={() => setActive(ind)}
                  aria-label={`Go to slide ${ind + 1}`}
                  className={`h-[2px] transition-all ${
                    ind === active ? "w-8 bg-foreground" : "w-4 bg-border"
                  }`}
                />
              ))}
              <span className="ml-2 text-muted-foreground font-sans text-[12px]">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
