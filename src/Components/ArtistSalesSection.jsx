import { FiTrendingUp } from "react-icons/fi";

const ArtistSalesSection = ({ sales }) => {
  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Sales history</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Every piece that's found a new wall.</p>

      {sales.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center border border-dashed border-border bg-card py-16">
          <FiTrendingUp className="h-7 w-7 text-muted-foreground" />
          <p className="mt-4 font-serif text-xl text-foreground">No sales yet</p>
          <p className="mt-1.5 text-sm text-muted-foreground">When your work sells it'll be recorded here.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Artwork</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Collector</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground">{sale.artwork}</td>
                  <td className="px-4 py-3 text-muted-foreground">{sale.collector}</td>
                  <td className="px-4 py-3 text-muted-foreground">{sale.date}</td>
                  <td className="px-4 py-3 text-right text-foreground">${sale.amount?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ArtistSalesSection;