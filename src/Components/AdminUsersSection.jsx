"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdOutlinePeople } from "react-icons/md";
import { toast } from "react-toastify";
import { getToken } from "@/lib/auth-client";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;
const ROLES = ["collector", "artist", "admin"];

const RoleBadge = ({ role }) => {
  if (role === "admin") {
    return (
      <span className="bg-foreground px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-background">
        Admin
      </span>
    );
  }
  if (role === "artist") {
    return (
      <span className="border border-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
        Artist
      </span>
    );
  }
  return (
    <span className="border border-border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
      Collector
    </span>
  );
};

const AdminUsersSection = ({ users, onRefresh }) => {
  const [query, setQuery] = useState("");
  const [changingId, setChangingId] = useState(null);

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  const handleRoleChange = async (userId, newRole) => {
    setChangingId(userId);
    const token = await getToken();
    const res = await fetch(`${SERVER}/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setChangingId(null);
    if (res.ok) {
      toast.success("Role updated.");
      onRefresh();
    } else {
      toast.error("Failed to update role.");
    }
  };

  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Users</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Everyone registered on the platform.</p>

      <div className="mt-8 flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-2.5 flex-1">
          <FiSearch className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or role..."
            className="bg-transparent font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none w-full"
          />
        </div>
        <p className="font-sans text-sm text-muted-foreground shrink-0 ml-6">{filtered.length}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-border bg-card py-16">
          <MdOutlinePeople className="h-7 w-7 text-muted-foreground" />
          <p className="mt-4 font-serif text-xl text-foreground">No users found</p>
          <p className="mt-1.5 text-sm text-muted-foreground">Try a different search term.</p>
        </div>
      ) : (
        <div className="overflow-hidden border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Joined</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const initial = (u.name?.[0] ?? "U").toUpperCase();
                return (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                          {initial}
                        </div>
                        <span className="font-sans text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.createdAt}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        disabled={changingId === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="border border-border bg-background px-2 py-1 font-sans text-xs text-foreground focus:border-foreground focus:outline-none disabled:opacity-40"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </option>
                        ))}
                      </select>
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

export default AdminUsersSection;