"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdReceiptLong } from "react-icons/md";

const AdminTransactionsSection = ({ transactions }) => {
  const [query, setQuery] = useState("");

  const filtered = transactions.filter((tx) => {
    const q = query.toLowerCase();
    return (
      tx.artwork?.toLowerCase().includes(q) ||
      tx.collector?.toLowerCase().includes(q) ||
      tx.artist?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Transactions</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Every purchase made on the platform.
      </p>

      <div className="mt-8 flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-2.5 flex-1">
          <FiSearch className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by artwork, collector or artist..."
            className="bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
          />
        </div>
        <p className="font-sans text-sm text-muted-foreground shrink-0 ml-6">
          {filtered.length}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border bg-card py-16">
          <MdReceiptLong className="h-7 w-7 text-muted-foreground" />
          <p className="mt-4 font-serif text-xl text-foreground">
            No transactions found
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Artwork
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Collector
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Artist
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-sans italic text-foreground">
                    {tx.artwork}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {tx.collector}
                  </td>
                  <td className="px-4 py-3 text-primary">{tx.artist}</td>
                  <td className="px-4 py-3 text-muted-foreground">{tx.date}</td>
                  <td className="px-4 py-3 text-right font-sans font-medium text-foreground">
                    ${tx.amount?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminTransactionsSection;