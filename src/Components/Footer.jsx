"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMail, FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center bg-primary text-primary-foreground font-sans text-sm font-semibold">
                A
              </div>
              <span className="font-serif text-lg text-foreground">ArtHub</span>
            </div>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              A quiet marketplace for{" "}
              <span className="text-primary">original art.</span> Discover work
              from studios across the world and bring{" "}
              <span className="text-primary">it home.</span>
            </p>
          </div>

         
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Explore</p>
            <ul className="space-y-2.5">
              {[
                { label: "Browse", href: "/browse" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy", href: "/privacy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-sans text-sm text-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

       
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-4">For Artists</p>
            <ul className="space-y-2.5">
              {[
                { label: "Open a studio", href: "/signup" },
                { label: "Artist dashboard", href: "/dashboard" },
                { label: "Pricing", href: "/pricing" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-sans text-sm text-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

   
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Newsletter</p>
            <p className="font-sans text-sm text-muted-foreground mb-4 leading-relaxed">
              Weekly dispatch. New works, no noise.
            </p>

            {subscribed ? (
              <p className="font-serif italic text-primary text-base">
                Subscribed. Welcome in.
              </p>
            ) : (
              <div className="flex items-center border border-border bg-background">
                <FiMail className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="you@studio.com"
                  className="flex-1 bg-transparent px-3 py-2.5 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  onClick={handleSubscribe}
                  className="px-3 py-2.5 font-sans text-sm text-primary hover:text-foreground transition-colors shrink-0"
                >
                  Join →
                </button>
              </div>
            )}

            <div className="flex items-center gap-4 mt-5">
              {[
                { icon: <FiInstagram className="h-4 w-4" />, href: "https://instagram.com" },
                { icon: <FiTwitter className="h-4 w-4" />, href: "https://twitter.com" },
                { icon: <FiFacebook className="h-4 w-4" />, href: "https://facebook.com" },
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

    
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-sans text-[11px] text-muted-foreground">
            © 2026 <Link href="/" className="text-primary hover:underline">ArtHub</Link>. All works © their respective artists.
          </p>
          <p className="font-sans text-[11px] text-muted-foreground">
            Made with care for collectors and the people who make.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;