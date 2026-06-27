"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient, getToken } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiSend } from "react-icons/fi";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

const ArtworkComments = ({ artworkId }) => {
  const [comments, setComments] = useState([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isCollector = user && user.role !== "artist" && user.role !== "admin";

  const fetchComments = useCallback(async () => {
    const res = await fetch(`${SERVER}/api/artworks/${artworkId}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  }, [artworkId]);

  const checkPurchase = useCallback(async () => {
    if (!isCollector) return;
    const token = await getToken();
    if (!token) return;

    const res = await fetch(`${SERVER}/api/collector/purchases`, {
      headers: { Authorization: token },
    });
    if (res.ok) {
      const purchases = await res.json();
      const owned = purchases.some((p) => p.artworkId === artworkId || p.id === artworkId);
      setHasPurchased(owned);
    }
  }, [artworkId, isCollector]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchComments(), checkPurchase()]);
      setLoading(false);
    };
    init();
  }, [fetchComments, checkPurchase]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    const token = await getToken();
    const res = await fetch(`${SERVER}/api/artworks/${artworkId}/comments`, {
      method: "POST",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ comment: text }),
    });
    setSubmitting(false);
    if (res.ok) {
      setText("");
      toast.success("Comment posted.");
      fetchComments();
    } else {
      const err = await res.json();
      toast.error(err.message || "Failed to post comment.");
    }
  };

  const handleEditSave = async (commentId) => {
    if (!editText.trim()) return;
    const token = await getToken();
    const res = await fetch(`${SERVER}/api/comments/${commentId}`, {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ comment: editText }),
    });
    if (res.ok) {
      toast.success("Comment updated.");
      setEditingId(null);
      setEditText("");
      fetchComments();
    } else {
      const err = await res.json();
      toast.error(err.message || "Failed to update comment.");
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("Delete this comment?")) return;
    setDeletingId(commentId);
    const token = await getToken();
    const res = await fetch(`${SERVER}/api/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });
    setDeletingId(null);
    if (res.ok) {
      toast.success("Comment deleted.");
      fetchComments();
    } else {
      toast.error("Failed to delete comment.");
    }
  };

  const openEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.comment);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="mt-14 border-t border-border pt-10">
      <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
        Collector Reviews
      </p>
      <h2 className="font-serif text-3xl text-foreground mb-8">
        Comments
      </h2>

    
      {isCollector && hasPurchased && (
        <div className="mb-8 border border-border bg-card p-5">
          <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            Leave a comment
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Share your thoughts on this piece…"
            className="w-full bg-background border border-border px-3.5 py-2.5 font-sans text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none resize-none"
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting || !text.trim()}
              className="flex items-center gap-2 bg-foreground px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <FiSend className="h-3.5 w-3.5" />
              {submitting ? "Posting…" : "Post comment"}
            </button>
          </div>
        </div>
      )}


      {isCollector && !hasPurchased && !loading && (
        <div className="mb-8 border border-dashed border-border bg-card px-6 py-5">
          <p className="font-sans text-sm text-muted-foreground">
            Purchase this artwork to leave a comment.
          </p>
        </div>
      )}

    
      {!user && (
        <div className="mb-8 border border-dashed border-border bg-card px-6 py-5">
          <p className="font-sans text-sm text-muted-foreground">
            <a href="/signin" className="text-primary hover:underline">Sign in</a> and purchase this artwork to leave a comment.
          </p>
        </div>
      )}

      {loading ? (
        <p className="font-sans text-sm text-muted-foreground">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="font-sans text-sm text-muted-foreground">
          No comments yet. Be the first collector to share your thoughts.
        </p>
      ) : (
        <div className="space-y-0">
          {comments.map((comment, ind) => {
            const isOwner = user && user.id === comment.userId;
            const isEditing = editingId === comment.id;

            return (
              <div key={ind} className="border-t border-border py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary font-sans text-xs font-semibold text-foreground">
                      {comment.userName?.[0]?.toUpperCase() ?? "C"}
                    </div>
                    <div>
                      <p className="font-sans text-sm font-medium text-foreground">
                        {comment.userName}
                      </p>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {isOwner && !isEditing && (
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => openEdit(comment)}
                        className="flex items-center gap-1 font-sans text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <FiEdit2 className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={deletingId === comment.id}
                        className="flex items-center gap-1 font-sans text-[11px] uppercase tracking-widest text-destructive hover:text-foreground transition-colors disabled:opacity-40"
                      >
                        <FiTrash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-4">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full bg-background border border-border px-3.5 py-2.5 font-sans text-sm text-foreground focus:border-foreground focus:outline-none resize-none"
                    />
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => handleEditSave(comment.id)}
                        disabled={!editText.trim()}
                        className="bg-foreground px-4 py-2 font-sans text-xs font-medium uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="border border-border px-4 py-2 font-sans text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 font-sans text-sm text-muted-foreground leading-relaxed ml-11">
                    {comment.comment}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ArtworkComments;