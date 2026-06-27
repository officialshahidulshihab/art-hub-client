import PurchaseTable from "./PurchaseTable";
import EmptyState from "./EmptyState";

const PurchaseHistorySection = ({ purchases }) => {
  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Purchase history</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Every work you've collected, with receipts.</p>
      {purchases.length === 0 ? (
        <EmptyState title="No purchases yet" subtitle="Pieces you collect will appear here." />
      ) : (
        <div className="mt-8">
          <PurchaseTable purchases={purchases} />
        </div>
      )}
    </>
  );
};

export default PurchaseHistorySection;