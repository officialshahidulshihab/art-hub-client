import Link from "next/link";

const DISCIPLINES = [
  { id: 1, name: "Painting", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80" },
  { id: 2, name: "Digital", image: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=600&q=80" },
  { id: 3, name: "Sculpture", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { id: 4, name: "Photography", image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80" },
  { id: 5, name: "Illustration", image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80" },
  { id: 6, name: "Mixed Media", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80" },
];

const BrowseByDiscipline = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 lg:px-0 py-16">
      <p className="text-primary font-sans text-[11px] uppercase tracking-widest mb-2">
        Discover
      </p>
      <h2 className="font-serif text-4xl text-foreground mb-8">
        Browse by discipline
      </h2>

      <div className="border border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {DISCIPLINES.map((discipline, i) => (
            <Link
              key={discipline.id}
              href={`/browse?category=${encodeURIComponent(discipline.name)}`}
              className={`group relative h-52 flex flex-col justify-between p-5 overflow-hidden
                border-border
                ${i % 3 !== 2 ? "lg:border-r" : ""}
                ${i % 2 !== 1 ? "sm:border-r lg:border-r-0" : ""}
                ${i < 3 ? "border-b" : ""}
              `}
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundImage: `url(${discipline.image})` }}
              />
              <span className="relative font-sans text-[11px] text-primary tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative">
                <p className="font-serif text-2xl text-foreground mb-1">{discipline.name}</p>
                <p className="font-sans text-[10px] uppercase tracking-widest text-primary">
                  Explore →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseByDiscipline;