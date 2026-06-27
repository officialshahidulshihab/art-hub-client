"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Avatar, Dropdown, Label, Separator } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/asset/arthub-icon.png";
import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleMenuAction = async (key) => {
    if (key === "dashboard") window.location.href = `/dashboard/${user.role}`;
    if (key === "profile") window.location.href = "/profile";
    if (key === "logout") {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/";
          },
        },
      });
    }
  };

  const BASE_LINKS = [
    { label: "Home", href: "/" },
    { label: "Browse Artworks", href: "/browse" },
    { label: "Artists", href: "/artists" },
    
  ];

  const NAV_LINKS = user
    ? [...BASE_LINKS, { label: "Dashboard", href: `/dashboard/${user.role}` }]
    : BASE_LINKS;

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const ThemeToggleIcon = () =>
    theme === "dark" ? (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="4" strokeWidth={2} />
        <path
          strokeLinecap="round"
          strokeWidth={2}
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        />
      </svg>
    ) : (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        />
      </svg>
    );

  if (pathname?.startsWith("/dashboard")) return null;
  if (pathname?.startsWith("/signin")) return null;
  if (pathname?.startsWith("/signup")) return null;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            className="text-foreground md:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={Logo}
              alt="ArtHub"
              width={32}
              height={35}
              priority
              className="h-8 w-auto"
            />
            <span className="font-serif text-xl text-foreground">ArtHub</span>
          </Link>
        </div>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item, ind) => (
            <li key={ind}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`border-b-2 pb-1 text-sm transition-colors ${
                  isActive(item.href)
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
          >
            <ThemeToggleIcon />
          </button>

          {user ? (
            <Dropdown>
              <Dropdown.Trigger>
                <Avatar className="cursor-pointer">
                  <Avatar.Image src={user.avatarUrl} alt={user.name} />
                  <Avatar.Fallback>{user.name?.[0]}</Avatar.Fallback>
                </Avatar>
              </Dropdown.Trigger>
              <Dropdown.Popover placement="bottom end">
                <Dropdown.Menu onAction={handleMenuAction}>
                  <Dropdown.Item id="dashboard" textValue="Dashboard">
                    <Label>Dashboard</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="profile" textValue="Profile">
                    <Label>Profile</Label>
                  </Dropdown.Item>
                  <Separator />
                  <Dropdown.Item
                    id="logout"
                    textValue="Logout"
                    variant="danger"
                  >
                    <Label>Logout</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-md border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </header>

      {isMenuOpen && (
        <div className="border-t border-border md:hidden">
          <ul className="flex flex-col gap-1 p-4">
            {NAV_LINKS.map((item, ind) => (
              <li key={ind}>
                <Link
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 text-sm ${
                    isActive(item.href)
                      ? "font-medium text-primary"
                      : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li className="mt-2 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Theme</span>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle dark mode"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
              >
                <ThemeToggleIcon />
              </button>
            </li>

            {!user ? (
              <li className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
                <Link
                  href="/signin"
                  className="w-full rounded-md border border-border px-4 py-2 text-center text-sm text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="w-full rounded-md bg-foreground px-4 py-2 text-center text-sm font-medium text-background"
                >
                  Join
                </Link>
              </li>
            ) : (
              <li className="mt-2 flex flex-col gap-2 border-t border-border pt-4 text-sm">
                <Link href={`/dashboard/${user.role}`} className="py-1">
                  Dashboard
                </Link>
                <Link href="/profile" className="py-1">
                  Profile
                </Link>
                <button
                  onClick={() => handleMenuAction("logout")}
                  className="py-1 text-left text-destructive"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
