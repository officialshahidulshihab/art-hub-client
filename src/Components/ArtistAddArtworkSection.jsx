"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { getToken } from "@/lib/auth-client";
import { FiUpload } from "react-icons/fi";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;
const CATEGORIES = ["Painting", "Digital", "Sculpture", "Photography", "Illustration", "Mixed Media"];

const ArtistAddArtworkSection = ({ onSuccess }) => {
  const [form, setForm] = useState({ title: "", price: "", category: "Painting", description: "", image: "" });
  const [submitting, setSubmitting] = useState(false);
  const urlInputRef = useRef(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.category || !form.image) {
      toast.error("Title, price, category and image are required.");
      return;
    }
    setSubmitting(true);
    const token = await getToken();
    const res = await fetch(`${SERVER}/api/artworks`, {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    setSubmitting(false);
    if (res.ok) { toast.success("Artwork published!"); onSuccess(); }
    else { const err = await res.json(); toast.error(err.message || "Failed to publish."); }
  };

  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Publish a new piece</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Upload an image, set a price, pay a small <span className="text-primary">publishing fee.</span>
      </p>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Artwork Image</p>
            <div
              onClick={() => urlInputRef.current?.focus()}
              className="relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center border border-dashed border-border bg-card transition-colors hover:bg-secondary/40"
            >
              {form.image ? (
                <img src={form.image} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <FiUpload className="h-7 w-7" />
                  <p className="font-sans text-sm">Click to upload</p>
                  <p className="font-sans text-xs">PNG or JPG, up to 10MB</p>
                </div>
              )}
            </div>
            <input
              ref={urlInputRef}
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="...or paste an image URL"
              className="mt-3 w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Title *</label>
              <input name="title" type="text" value={form.title} onChange={handleChange}
                className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Price (USD) *</label>
                <input name="price" type="number" value={form.price} onChange={handleChange}
                  className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Description</label>
              <textarea name="description" rows={4} value={form.description} onChange={handleChange}
                placeholder="Describe the work, its inspiration, materials…"
                className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none resize-none" />
            </div>

            <div className="border border-border bg-card px-4 py-3">
              <p className="font-sans text-sm font-semibold text-foreground">Publishing fee: $25</p>
              <p className="font-sans text-xs text-muted-foreground mt-0.5">
                Simulated Stripe charge. Confirms listing goes <span className="text-primary">live</span> to the gallery.
              </p>
            </div>

            <button type="submit" disabled={submitting}
              className="w-full bg-foreground px-4 py-3 text-sm font-medium uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50">
              {submitting ? "Publishing…" : "Publish artwork ($25 fee)"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ArtistAddArtworkSection;