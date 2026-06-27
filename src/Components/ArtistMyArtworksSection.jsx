"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { getToken } from "@/lib/auth-client";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;
const CATEGORIES = ["Painting", "Digital", "Sculpture", "Photography", "Illustration", "Mixed Media"];

const ArtistMyArtworksSection = ({ artworks, onGoTo, onRefresh }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const handleDelete = async (id) => {
    if (!confirm("Remove this artwork from the gallery?")) return;
    setDeletingId(id);
    const token = await getToken();
    const res = await fetch(`${SERVER}/api/artworks/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });
    setDeletingId(null);
    if (res.ok) { toast.success("Artwork removed."); onRefresh(); }
    else { toast.error("Failed to remove artwork."); }
  };

  const openEdit = (artwork) => {
    setEditingArtwork(artwork);
    setEditForm({
      title: artwork.title ?? "",
      price: artwork.price ?? "",
      category: artwork.category ?? "Painting",
      description: artwork.description ?? "",
      image: artwork.image ?? "",
    });
  };

  const handleEditSave = async () => {
    const id = editingArtwork._id?.$oid || editingArtwork._id;
    setSaving(true);
    const token = await getToken();
    const res = await fetch(`${SERVER}/api/artworks/${id}`, {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, price: Number(editForm.price) }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Artwork updated.");
      setEditingArtwork(null);
      onRefresh();
    } else {
      toast.error("Failed to update artwork.");
    }
  };

  if (editingArtwork) {
    return (
      <>
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setEditingArtwork(null)}
            className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
          <span className="text-muted-foreground">/</span>
          <p className="font-sans text-[11px] uppercase tracking-widest text-foreground">
            Editing artwork
          </p>
        </div>

        <h1 className="font-serif text-4xl text-foreground">Edit artwork</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Update the details below and save.</p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Artwork Image</p>
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-card">
              {editForm.image ? (
                <img src={editForm.image} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <p className="font-sans text-sm">No image</p>
                </div>
              )}
            </div>
            <input
              type="text"
              value={editForm.image}
              onChange={(e) => setEditForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="Paste image URL"
              className="mt-3 w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Title *</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Price (USD) *</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Description</label>
              <textarea
                rows={4}
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                onClick={() => setEditingArtwork(null)}
                className="border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">My artworks</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Manage, edit, and delete your works.</p>

      {artworks.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center border border-dashed border-border bg-card py-16">
          <FiEdit2 className="h-7 w-7 text-muted-foreground" />
          <p className="mt-4 font-serif text-xl text-foreground">No artworks yet</p>
          <p className="mt-1.5 text-sm text-muted-foreground">Add your first piece to start selling.</p>
          <button
            onClick={() => onGoTo("add")}
            className="mt-6 flex items-center gap-2 bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
          >
            <MdOutlineAddPhotoAlternate className="h-4 w-4" />
            Add artwork
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((artwork) => {
            const id = artwork._id?.$oid || artwork._id;
            return (
              <div key={id} className="border border-border bg-card">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="font-serif italic text-base text-foreground">{artwork.title}</p>
                  <p className="font-sans text-sm text-muted-foreground mt-1">
                    ${artwork.price?.toLocaleString()} · {artwork.category}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={() => openEdit(artwork)}
                      className="flex flex-1 items-center justify-center gap-1.5 border border-border px-3 py-1.5 font-sans text-[11px] uppercase tracking-widest text-foreground transition-colors hover:bg-secondary"
                    >
                      <FiEdit2 className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      disabled={deletingId === id}
                      className="flex flex-1 items-center justify-center gap-1.5 border border-destructive px-3 py-1.5 font-sans text-[11px] uppercase tracking-widest text-destructive transition-colors hover:bg-destructive hover:text-white disabled:opacity-40"
                    >
                      <FiTrash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ArtistMyArtworksSection;