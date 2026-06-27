import Link from "next/link";

export const metadata = { title: "Payment Cancelled — ArtHub" };

const CancelPage = () => {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <p className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
          Payment cancelled
        </p>
        <h1 className="font-serif text-4xl text-foreground">
          No charge was made.
        </h1>
        <p className="mt-4 font-sans text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          You cancelled the checkout. Your card was not charged. Head back whenever you're ready.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/browse"
            className="bg-foreground px-6 py-3 font-sans text-sm font-medium uppercase tracking-widest text-background transition-opacity hover:opacity-90"
          >
            Back to gallery
          </Link>
          <Link
            href="/"
            className="border border-border px-6 py-3 font-sans text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-secondary"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;