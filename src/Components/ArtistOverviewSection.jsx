import { MdOutlinePhotoLibrary, MdOutlineAddPhotoAlternate } from "react-icons/md";
import { FiEye, FiCheckCircle, FiDollarSign } from "react-icons/fi";

const ArtistOverviewSection = ({ userName, stats, sales, onGoTo }) => {
  const recentSales = sales.slice(0, 3);

  const statItems = [
    { icon: <MdOutlinePhotoLibrary className="h-4 w-4" />, label: "Total Works", value: stats.totalWorks, valueClass: "text-foreground" },
    { icon: <FiEye className="h-4 w-4" />, label: "Live Now", value: stats.liveNow, valueClass: "text-foreground" },
    { icon: <FiCheckCircle className="h-4 w-4" />, label: "Sold", value: stats.sold, valueClass: "text-foreground" },
    { icon: <FiDollarSign className="h-4 w-4" />, label: "Revenue", value: `$${stats.revenue?.toLocaleString()}`, valueClass: "text-primary" },
  ];

  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Studio overview</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Your studio at a glance, <span className="text-primary">{userName}.</span>
      </p>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 border border-border">
        {statItems.map((stat, i) => (
          <div key={i} className={`px-6 py-5 ${i < statItems.length - 1 ? "border-r border-border" : ""}`}>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              {stat.icon}
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em]">{stat.label}</p>
            </div>
            <p className={`font-serif text-3xl ${stat.valueClass}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-border bg-card px-6 py-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">Recent Sales</p>
            <button
              onClick={() => onGoTo("sales")}
              className="font-sans text-[11px] uppercase tracking-widest text-primary hover:text-foreground transition-colors"
            >
              View all →
            </button>
          </div>
          <p className="font-serif text-2xl text-foreground mb-4">{sales.length} transactions</p>
          {recentSales.length === 0 ? (
            <p className="font-sans text-sm text-muted-foreground">No sales yet.</p>
          ) : (
            <div className="space-y-0">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between border-t border-border py-3">
                  <div>
                    <p className="font-sans text-sm text-foreground">{sale.artwork}</p>
                    <p className="font-sans text-xs text-muted-foreground">{sale.date}</p>
                  </div>
                  <p className="font-sans text-sm text-foreground">${sale.amount?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-border bg-card px-6 py-5 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary mb-3">Studio Tip</p>
            <p className="font-serif text-xl text-foreground leading-snug">
              Strong images sell. Square or 4:5 with even, natural light tend to convert best.
            </p>
          </div>
          <button
            onClick={() => onGoTo("add")}
            className="mt-8 flex items-center justify-center gap-2 bg-foreground px-4 py-3 text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
          >
            <MdOutlineAddPhotoAlternate className="h-4 w-4" />
            Add new artwork
          </button>
        </div>
      </div>
    </>
  );
};

export default ArtistOverviewSection;