import Image from "next/image";
import Link from "next/link";

const PurchaseTable = ({ purchases }) => {
  return (
    <div className="overflow-hidden border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card">
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Artwork</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Artist</th>
            <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Date</th>
            <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Amount</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((item) => (
            <tr key={item.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.artwork}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-sans text-foreground italic">{item.artwork}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/artists/${item.artistId}`}
                  className="font-sans text-primary hover:text-foreground transition-colors"
                >
                  {item.artist}
                </Link>
              </td>
              <td className="px-4 py-3 font-sans text-muted-foreground">{item.date}</td>
              <td className="px-4 py-3 text-right font-sans font-medium text-foreground">
                ${item.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseTable;