"use client";

import { useState } from "react";
import { authClient, getToken } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

const BuyButton = ({ artwork }) => {
  const [buying, setBuying] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const user = session?.user;
  const role = user?.role;

  const handleBuy = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }

    if (role === "artist" || role === "admin") {
      toast.error("Artists and admins cannot purchase artworks.");
      return;
    }

    setBuying(true);

    const token = await getToken();
    if (!token) {
      toast.error("Session expired. Please sign in again.");
      setBuying(false);
      return;
    }

    const res = await fetch(`${SERVER}/api/stripe/artwork-session`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        artworkId: artwork.id,
        artwork: artwork.title,
        artist: artwork.artistName,
        artistId: artwork.artistId,
        amount: artwork.price,
        image: artwork.image,
        category: artwork.category,
      }),
    });

    setBuying(false);

    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      const err = await res.json();
      toast.error(err.message || "Failed to initiate checkout.");
    }
  };

  const getButtonLabel = () => {
    if (buying) return "Redirecting to checkout…";
    if (!session) return "Sign in to purchase";
    if (role === "artist") return "Artists cannot purchase";
    if (role === "admin") return "Admins cannot purchase";
    return "Purchase artwork";
  };

  const isDisabled = buying || role === "artist" || role === "admin";

  return (
    <button
      onClick={handleBuy}
      disabled={isDisabled}
      className="w-full rounded-none bg-foreground px-6 py-3.5 font-sans text-sm font-medium uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {getButtonLabel()}
    </button>
  );
};

export default BuyButton;