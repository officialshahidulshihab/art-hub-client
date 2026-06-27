import StatCard from "./StatCard";
import PurchaseTable from "./PurchaseTable";
import EmptyState from "./EmptyState";

const OverviewSection = ({ userName, stats, planPercent, purchases }) => {
  const recentPurchases = purchases.slice(0, 3);

  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Glad to see you again, <span className="text-primary">{userName}.</span>
      </p>

      <div className="mt-8 flex gap-0 border border-border">
        <StatCard label="Works Collected" value={stats.worksCollected} />
        <div className="w-px bg-border" />
        <StatCard label="Total Spent" value={stats.totalSpent} />
        <div className="w-px bg-border" />
        <StatCard label="Current Plan" value={stats.currentPlan} valueClass="text-primary" />
      </div>

      <div className="mt-4 border border-border bg-card px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Plan Usage</p>
        <p className="mt-2 font-serif text-3xl text-foreground">
          {stats.planUsed} / {stats.planMax} <span className="text-2xl">purchases</span>
        </p>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-none bg-border">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${planPercent}%` }} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-2xl text-foreground">Recent activity</h2>
        {recentPurchases.length === 0 ? (
          <EmptyState title="No purchases yet" subtitle="Pieces you collect will appear here." />
        ) : (
          <div className="mt-4">
            <PurchaseTable purchases={recentPurchases} />
          </div>
        )}
      </div>
    </>
  );
};

export default OverviewSection;