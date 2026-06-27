import GalleryCard from "./GalleryCard";
import EmptyState from "./EmptyState";

const GallerySection = ({ items }) => {
  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Your gallery</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">The pieces you've brought home.</p>
      {items.length === 0 ? (
        <EmptyState title="Your gallery is empty" subtitle="Collected artworks will be displayed here." />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </>
  );
};

export default GallerySection;