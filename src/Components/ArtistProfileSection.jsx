"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { authClient, getToken } from "@/lib/auth-client";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

const ArtistProfileSection = ({ user }) => {
  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.image ?? "");
  const [location, setLocation] = useState("");
  const [statement, setStatement] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const userInitial = (user?.name?.[0] ?? "A").toUpperCase();

  useEffect(() => {
    const loadProfile = async () => {
      const token = await getToken();
      if (!token) return;
      const res = await fetch(`${SERVER}/api/artist/profile`, {
        headers: { Authorization: token },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.location) setLocation(data.location);
      if (data.bio) setStatement(data.bio);
      if (data.avatar) setAvatarUrl(data.avatar);
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await authClient.updateUser({ name: displayName, image: avatarUrl });
    if (error) { setSaving(false); toast.error(error.message); return; }

    const token = await getToken();
    await fetch(`${SERVER}/api/artist/profile`, {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ location, statement, avatar: avatarUrl }),
    });

    setSaving(false);
    toast.success("Profile saved!");
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword) { toast.error("Please enter your current password."); return; }
    if (newPassword.length < 8) { toast.error("New password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords don't match."); return; }

    setSavingPassword(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setSavingPassword(false);

    if (error) { toast.error(error.message); return; }
    toast.success("Password updated!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Artist profile</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">How collectors see you.</p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="border border-border bg-card px-6 py-6 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary text-3xl font-semibold text-white">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              userInitial
            )}
          </div>
          <p className="mt-4 font-serif text-xl text-primary">{displayName || user?.name}</p>
          <p className="mt-1 font-sans text-xs text-muted-foreground truncate max-w-full px-2">{user?.email}</p>
          <button className="mt-5 border border-border px-4 py-2 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-secondary">
            Change avatar
          </button>
          <input
            type="text"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="...or paste image URL"
            className="mt-3 w-full border border-border bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none text-left"
          />
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Display name *</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Artist statement</label>
            <textarea
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              rows={4}
              placeholder="A short paragraph about your practice."
              className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none resize-none"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </div>
      </div>

      <div className="mt-8 border border-border bg-card px-6 py-6">
        <h2 className="font-serif text-xl text-foreground">Change password</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enter your current password to set a new one.</p>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Current password</label>
            <input
              type="password"
              placeholder="Your existing password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">New password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Confirm password</label>
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleUpdatePassword}
          disabled={savingPassword}
          className="mt-5 bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {savingPassword ? "Updating…" : "Update password"}
        </button>
      </div>
    </>
  );
};

export default ArtistProfileSection;