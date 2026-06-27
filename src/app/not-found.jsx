import Link from "next/link";

export const metadata = { title: "Page Not Found — ArtHub" };

const NotFound = () => {
  return (
    <div className="bg-background min-h-screen flex flex-col">

     
      <div className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full">

       
          <div className="relative select-none mb-10">
            <p
              className="font-serif leading-none text-center"
              style={{ fontSize: "clamp(8rem, 22vw, 18rem)", color: "#D4CFC4" }}
            >
              404
            </p>
           
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border border-border bg-background px-5 py-2.5">
                <p className="font-sans text-[11px] uppercase tracking-widest text-primary">
                  Work not found
                </p>
              </div>
            </div>
          </div>

          
          <div className="text-center">
            <h1 className="font-serif text-4xl text-foreground leading-tight">
              This canvas is empty.
            </h1>
            <p className="mt-4 font-sans text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              The page you're looking for has moved, been removed, or never existed.
              Head back to the gallery — there's plenty to discover.
            </p>
          </div>

        
          <div className="flex items-center gap-4 my-10 max-w-xs mx-auto">
            <span className="h-px flex-1 bg-border" />
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
              Where to next?
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

        
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="bg-foreground px-7 py-3 font-sans text-sm font-medium uppercase tracking-widest text-background transition-opacity hover:opacity-90 w-full sm:w-auto text-center"
            >
              Go home
            </Link>
            <Link
              href="/browse"
              className="border border-border px-7 py-3 font-sans text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-secondary w-full sm:w-auto text-center"
            >
              Browse artworks
            </Link>
            <Link
              href="/artists"
              className="border border-border px-7 py-3 font-sans text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-secondary w-full sm:w-auto text-center"
            >
              Meet the artists
            </Link>
          </div>

        
          <p className="mt-12 text-center font-sans text-[11px] text-muted-foreground">
            If you followed a link that should work,{" "}
            <Link href="/contact" className="text-primary hover:underline underline-offset-2">
              let us know.
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default NotFound;