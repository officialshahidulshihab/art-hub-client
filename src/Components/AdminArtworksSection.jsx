"use client";

import { useState } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import { toast } from "react-toastify";
import { getToken } from "@/lib/auth-client";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

const StatusBadge = ({ status }) => {
  if (status === "published") {
    return (
      <span className="border border-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
        Published
      </span>
    );
  }
  return (
    <span className="border border-border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
      Draft
    </span>
  );
};

const AdminArtworksSection = ({ artworks, onRefresh }) => {
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const filtered = artworks.filter((a) => {
    const q = query.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.artistName?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id) => {
    if (!confirm("Remove this artwork from the platform?")) return;
    setDeletingId(id);
    const token = await getToken();
    const res = await fetch(`${SERVER}/api/admin/artworks/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });
    setDeletingId(null);
    if (res.ok) {
      toast.success("Artwork removed.");
      onRefresh();
    } else {
      toast.error("Failed to remove artwork.");
    }
  };

  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Artworks</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Every piece listed on the platform.
      </p>

      <div className="mt-8 flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-2.5 flex-1">
          <FiSearch className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, artist or category..."
            className="bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
          />
        </div>
        <p className="font-sans text-sm text-muted-foreground shrink-0 ml-6">
          {filtered.length}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border bg-card py-16">
          <MdOutlinePhotoLibrary className="h-7 w-7 text-muted-foreground" />
          <p className="mt-4 font-serif text-xl text-foreground">
            No artworks found
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
                  Artist
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((artwork) => {
                const id = artwork._id?.$oid || artwork._id;
                return (
                  <tr key={id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-muted">
                          <img
                            src={artwork.image}
                            alt={artwork.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="font-sans text-foreground italic">
                          {artwork.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {artwork.artistName}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {artwork.category}
                    </td>
                    <td className="px-4 py-3 font-sans text-foreground">
                      ${artwork.price?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={artwork.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(id)}
                        disabled={deletingId === id}
                        className="flex items-center gap-1.5 font-sans text-[11px] uppercase tracking-widest text-destructive hover:text-foreground transition-colors disabled:opacity-40"
                      >
                        <FiTrash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminArtworksSection;