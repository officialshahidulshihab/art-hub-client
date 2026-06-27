"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const ConditionalFooter = () => {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) return null;
  if (pathname?.startsWith("/signin")) return null;
  if (pathname?.startsWith("/signup")) return null;
  if (pathname?.startsWith("/success")) return null;
if (pathname?.startsWith("/cancel")) return null;

  return <Footer />;
};

export default ConditionalFooter;