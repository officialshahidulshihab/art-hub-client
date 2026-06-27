"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { authClient, getToken } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import {
  MdDashboard,
  MdOutlinePhotoLibrary,
  MdOutlineAddPhotoAlternate,
} from "react-icons/md";
import { FaRegClock, FaRegUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import NavItem from "@/Components/NavItem";
import ArtistOverviewSection from "@/Components/ArtistOverviewSection";
import ArtistMyArtworksSection from "@/Components/ArtistMyArtworksSection";
import ArtistAddArtworkSection from "@/Components/ArtistAddArtworkSection";
import ArtistSalesSection from "@/Components/ArtistSalesSection";
import ArtistProfileSection from "@/Components/ArtistProfileSection";

const VALID_TABS = ["overview", "artworks", "add", "sales", "profile"];
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

const getTabFromHash = () => {
  if (typeof window === "undefined") return "overview";
  const hash = window.location.hash.replace("#", "");
  return VALID_TABS.includes(hash) ? hash : "overview";
};

const ArtistDashboard = () => {
  const [activeNav, setActiveNav] = useState("overview");
  const [sales, setSales] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [stats, setStats] = useState({
    totalWorks: 0,
    liveNow: 0,
    sold: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const userName = user?.name ?? "Artist";
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

      const [statsRes, salesRes, artworksRes] = await Promise.all([
        fetch(`${SERVER}/api/artist/stats`, { headers }),
        fetch(`${SERVER}/api/artist/sales`, { headers }),
        fetch(`${SERVER}/api/artworks/mine`, { headers }),
      ]);

      const [statsData, salesData, artworksData] = await Promise.all([
        statsRes.json(),
        salesRes.json(),
        artworksRes.json(),
      ]);

      setStats(statsData);
      setSales(Array.isArray(salesData) ? salesData : []);
      setArtworks(Array.isArray(artworksData) ? artworksData : []);
    } catch {
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchAll();
    else setLoading(false);
  }, [user, fetchAll]);

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
      id: "artworks",
      label: "My artworks",
      icon: <MdOutlinePhotoLibrary className="h-4 w-4" />,
    },
    {
      id: "add",
      label: "Add artwork",
      icon: <MdOutlineAddPhotoAlternate className="h-4 w-4" />,
    },
    {
      id: "sales",
      label: "Sales history",
      icon: <FaRegClock className="h-4 w-4" />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <FaRegUser className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <aside className="flex w-60 flex-shrink-0 flex-col border-r border-border bg-background">
        <div className="px-6 pb-5 pt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Welcome
          </p>
          <p className="mt-1 font-serif text-base text-foreground">
            {userName}
          </p>
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
              Artist
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
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="font-sans text-sm text-muted-foreground">
                Loading your studio…
              </p>
            </div>
          ) : (
            <>
              {activeNav === "overview" && (
                <ArtistOverviewSection
                  userName={userName}
                  stats={stats}
                  sales={sales}
                  onGoTo={goTo}
                />
              )}
              {activeNav === "artworks" && (
                <ArtistMyArtworksSection
                  artworks={artworks}
                  onGoTo={goTo}
                  onRefresh={fetchAll}
                />
              )}
              {activeNav === "add" && (
                <ArtistAddArtworkSection
                  onSuccess={() => {
                    fetchAll();
                    goTo("artworks");
                  }}
                />
              )}
              {activeNav === "sales" && <ArtistSalesSection sales={sales} />}
              {activeNav === "profile" && <ArtistProfileSection user={user} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ArtistDashboard;
