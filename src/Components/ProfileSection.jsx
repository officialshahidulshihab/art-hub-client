"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

const FormField = ({ label, id, ...props }) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
      />
    </div>
  );
};

const ProfileSection = ({ user }) => {
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const userInitial = (user?.name?.[0] ?? "U").toUpperCase();

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const { error } = await authClient.updateUser({ name: fullName });
    setSavingProfile(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated!");
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
      <h1 className="font-serif text-4xl text-foreground">Profile & account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Keep your details current.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-border bg-card px-6 py-6">
          <h2 className="font-serif text-xl text-foreground">Personal details</h2>
          <p className="mt-1 text-sm text-muted-foreground">Shown on your profile and receipts.</p>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-primary text-xl font-semibold text-white">
              {userInitial}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <FormField
              label="Full name"
              id="fullName"
              name="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <FormField
              label="Email"
              id="email"
              name="email"
              type="email"
              value={email}
              disabled
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="mt-6 bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {savingProfile ? "Saving…" : "Save changes"}
          </button>
        </div>

        <div className="border border-border bg-card px-6 py-6">
          <h2 className="font-serif text-xl text-foreground">Change password</h2>
          <p className="mt-1 text-sm text-muted-foreground">Enter your current password to set a new one.</p>

          <div className="mt-5 space-y-4">
            <FormField
              label="Current password"
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Your existing password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <FormField
              label="New password"
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <FormField
              label="Confirm new password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleUpdatePassword}
            disabled={savingPassword}
            className="mt-6 bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {savingPassword ? "Updating…" : "Update password"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileSection;