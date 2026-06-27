"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { authClient, getToken } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { MdDashboard, MdOutlinePhotoLibrary } from "react-icons/md";
import { FaRegClock, FaRegStar, FaRegUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import NavItem from "@/Components/NavItem";
import OverviewSection from "@/Components/OverviewSection";
import PurchaseHistorySection from "@/Components/PurchaseHistorySection";
import GallerySection from "@/Components/GallerySection";
import SubscriptionSection from "@/Components/SubscriptionSection";
import ProfileSection from "@/Components/ProfileSection";

const VALID_TABS = [
  "overview",
  "purchases",
  "gallery",
  "subscription",
  "profile",
];
const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

const getTabFromHash = () => {
  if (typeof window === "undefined") return "overview";
  const hash = window.location.hash.replace("#", "");
  return VALID_TABS.includes(hash) ? hash : "overview";
};

const CollectorDashboard = () => {
  const [activeNav, setActiveNav] = useState("overview");
  const [purchases, setPurchases] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [planId, setPlanId] = useState("collector");
  const [stats, setStats] = useState({
    worksCollected: 0,
    totalSpent: "$0",
    currentPlan: "Collector",
    planId: "collector",
    planUsed: 0,
    planMax: 3,
  });
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const userName = user?.name ?? "Guest";
  const userEmail = user?.email ?? "";
  const userInitial = userName?.[0]?.toUpperCase() ?? "U";

  const fetchAll = useCallback(async () => {
    const token = await getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const headers = { Authorization: token };

      const [statsRes, purchasesRes, galleryRes, planRes] = await Promise.all([
        fetch(`${SERVER}/api/collector/stats`, { headers }),
        fetch(`${SERVER}/api/collector/purchases`, { headers }),
        fetch(`${SERVER}/api/collector/gallery`, { headers }),
        fetch(`${SERVER}/api/collector/plan`, { headers }),
      ]);

      const [statsData, purchasesData, galleryData, planData] =
        await Promise.all([
          statsRes.json(),
          purchasesRes.json(),
          galleryRes.json(),
          planRes.json(),
        ]);

      setStats(statsData);
      setPurchases(Array.isArray(purchasesData) ? purchasesData : []);
      setGallery(Array.isArray(galleryData) ? galleryData : []);
      setPlanId(planData.planId || "collector");
    } catch {
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAll();
    } else {
      setLoading(false);
    }
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

  const handleSelectPlan = async (newPlanId) => {
    const token = await getToken();

    if (!token) {
      toast.error("Session expired. Please sign in again.");
      return;
    }

    const res = await fetch(`${SERVER}/api/collector/plan`, {
      method: "PATCH",
      headers: { Authorization: token, "Content-Type": "application/json" },
      body: JSON.stringify({ planId: newPlanId }),
    });

    if (res.ok) {
      const planLabel = newPlanId.charAt(0).toUpperCase() + newPlanId.slice(1);
      toast.success(`Switched to ${planLabel} plan.`);
      await fetchAll();
    } else {
      toast.error("Failed to update plan. Please try again.");
    }
  };

  const isPremium = stats.planMax >= 9999;
  const displayStats = {
    ...stats,
    planMax: isPremium ? "Unlimited" : stats.planMax,
  };
  const planPercent = isPremium
    ? 0
    : Math.min(100, Math.round((stats.planUsed / stats.planMax) * 100));

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: <MdDashboard className="h-4 w-4" />,
    },
    {
      id: "purchases",
      label: "Purchase history",
      icon: <FaRegClock className="h-4 w-4" />,
    },
    {
      id: "gallery",
      label: "My gallery",
      icon: <MdOutlinePhotoLibrary className="h-4 w-4" />,
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: <FaRegStar className="h-4 w-4" />,
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
              Collector
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

        <main className="flex-1 overflow-y-auto bg-[#F2EFE6] px-10 py-10">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="font-sans text-sm text-muted-foreground">
                Loading your dashboard…
              </p>
            </div>
          ) : (
            <>
              {activeNav === "overview" && (
                <OverviewSection
                  userName={userName}
                  stats={displayStats}
                  planPercent={planPercent}
                  purchases={purchases}
                />
              )}
              {activeNav === "purchases" && (
                <PurchaseHistorySection purchases={purchases} />
              )}
              {activeNav === "gallery" && <GallerySection items={gallery} />}
              {activeNav === "subscription" && (
                <SubscriptionSection
                  currentPlanId={planId}
                  onSelectPlan={handleSelectPlan}
                />
              )}
              {activeNav === "profile" && <ProfileSection user={user} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CollectorDashboard;
