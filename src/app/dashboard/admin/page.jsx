"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { authClient, getToken } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import {
  MdDashboard,
  MdOutlinePhotoLibrary,
  MdOutlinePeople,
  MdReceiptLong,
  MdOutlineBarChart,
} from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import NavItem from "@/Components/NavItem";
import AdminOverviewSection from "@/Components/AdminOverviewSection";
import AdminUsersSection from "@/Components/AdminUsersSection";
import AdminArtworksSection from "@/Components/AdminArtworksSection";
import AdminTransactionsSection from "@/Components/AdminTransactionsSection";
import AdminAnalyticsSection from "@/Components/AdminAnalyticsSection";

const VALID_TABS = ["overview", "users", "artworks", "transactions", "analytics"];
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

const getTabFromHash = () => {
  if (typeof window === "undefined") return "overview";
  const hash = window.location.hash.replace("#", "");
  return VALID_TABS.includes(hash) ? hash : "overview";
};

const AdminDashboard = () => {
  const [activeNav, setActiveNav] = useState("overview");
  const [stats, setStats] = useState({
    users: 0,
    artworks: 0,
    transactions: 0,
    revenue: 0,
    artists: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [salesOverTime, setSalesOverTime] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const userName = user?.name ?? "Admin";
  const userEmail = user?.email ?? "";
  const userInitial = userName?.[0]?.toUpperCase() ?? "A";

  const fetchAll = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const headers = { Authorization: token };

      const [statsRes, transactionsRes, usersRes, artworksRes, salesRes, categoriesRes] =
        await Promise.all([
          fetch(`${SERVER}/api/admin/stats`, { headers }),
          fetch(`${SERVER}/api/admin/transactions`, { headers }),
          fetch(`${SERVER}/api/admin/users`, { headers }),
          fetch(`${SERVER}/api/admin/artworks`, { headers }),
          fetch(`${SERVER}/api/admin/sales-over-time`, { headers }),
          fetch(`${SERVER}/api/admin/categories`, { headers }),
        ]);

      const [
        statsData,
        transactionsData,
        usersData,
        artworksData,
        salesData,
        categoriesData,
      ] = await Promise.all([
        statsRes.json(),
        transactionsRes.json(),
        usersRes.json(),
        artworksRes.json(),
        salesRes.json(),
        categoriesRes.json(),
      ]);

      setStats(statsData);
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setArtworks(Array.isArray(artworksData) ? artworksData : []);
      setSalesOverTime(Array.isArray(salesData) ? salesData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch {
      toast.error("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role !== "admin") {
        router.replace("/");
        return;
      }
      fetchAll();
    } else {
      setLoading(false);
    }
  }, [user, fetchAll, router]);

  useEffect(() => {
    const syncFromHash = () => setActiveNav(getTabFromHash());
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("popstate", syncFromHash);
    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("popstate", syncFromHash);
    };
  }, []);

  const goTo = (id) => {
    setActiveNav(id);
    router.push(`${pathname}#${id}`, { scroll: false });
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <MdDashboard className="h-4 w-4" />,
    },
    {
      id: "users",
      label: "Users",
      icon: <MdOutlinePeople className="h-4 w-4" />,
    },
    {
      id: "artworks",
      label: "Artworks",
      icon: <MdOutlinePhotoLibrary className="h-4 w-4" />,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: <MdReceiptLong className="h-4 w-4" />,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <MdOutlineBarChart className="h-4 w-4" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="font-sans text-sm text-muted-foreground">
          Loading admin console…
        </p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="font-sans text-sm text-muted-foreground">
          Access denied.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="flex w-60 flex-shrink-0 flex-col border-r border-border bg-background">
        <div className="px-6 pb-5 pt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Welcome
          </p>
          <p className="mt-1 font-serif text-base text-foreground">{userName}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {userEmail}
          </p>
        </div>

        <nav className="flex flex-col gap-0.5 py-2">
          {navItems.map((item, ind) => (
            <NavItem
              key={ind}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.id}
              onClick={() => goTo(item.id)}
            />
          ))}
        </nav>

        <div className="mt-auto border-t border-border py-3">
          <NavItem
            icon={<FiLogOut className="h-4 w-4" />}
            label="Sign out"
            onClick={handleSignOut}
          />
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-14 items-center justify-between border-b border-border bg-background px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-serif text-base text-foreground">
              ArtHub
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/browse"
              className="rounded-none border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-secondary"
            >
              Visit Gallery
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {userInitial}
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-background px-10 py-10">
          {activeNav === "overview" && (
            <AdminOverviewSection
              stats={stats}
              transactions={transactions}
              users={users}
              salesOverTime={salesOverTime}
              categories={categories}
              onGoTo={goTo}
            />
          )}
          {activeNav === "users" && (
            <AdminUsersSection users={users} onRefresh={fetchAll} />
          )}
          {activeNav === "artworks" && (
            <AdminArtworksSection artworks={artworks} onRefresh={fetchAll} />
          )}
          {activeNav === "transactions" && (
            <AdminTransactionsSection transactions={transactions} />
          )}
          {activeNav === "analytics" && (
            <AdminAnalyticsSection
              salesOverTime={salesOverTime}
              categories={categories}
              stats={stats}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;