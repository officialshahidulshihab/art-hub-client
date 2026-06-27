"use client";

import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { getToken } from "@/lib/auth-client";
import { toast } from "react-toastify";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

const PLANS = [
  {
    id: "collector",
    name: "Collector",
    order: 0,
    price: 0,
    cadence: "3 works per month",
    features: ["Browse the full gallery", "Wishlist & comments", "Up to 3 purchases"],
  },
  {
    id: "pro",
    name: "Pro",
    order: 1,
    price: 9.99,
    cadence: "9 works per month",
    features: ["Everything in Collector", "Up to 9 purchases", "Early access to drops"],
  },
  {
    id: "premium",
    name: "Premium",
    order: 2,
    price: 19.99,
    cadence: "Unlimited per month",
    features: ["Everything in Pro", "Unlimited purchases", "Concierge & private viewings"],
  },
];

const SubscriptionSection = ({ currentPlanId, onSelectPlan }) => {
  const [loading, setLoading] = useState(null);
  const currentPlan = PLANS.find((p) => p.id === currentPlanId) ?? PLANS[0];

  const handleSelect = async (plan) => {
    if (plan.id === currentPlan.id) return;

    if (plan.price === 0) {
      onSelectPlan(plan.id);
      return;
    }

    setLoading(plan.id);

    const token = await getToken();
    if (!token) {
      toast.error("Session expired. Please sign in again.");
      setLoading(null);
      return;
    }

    const res = await fetch(`${SERVER}/api/stripe/subscription-session`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planId: plan.id }),
    });

    setLoading(null);

    if (res.ok) {
      const { url } = await res.json();
      window.location.href = url;
    } else {
      const err = await res.json();
      toast.error(err.message || "Failed to initiate checkout.");
    }
  };

  return (
    <>
      <h1 className="font-serif text-4xl text-foreground">Subscription</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Choose how often you collect.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan.id;
          const isDowngrade = plan.order < currentPlan.order;
          const isLoading = loading === plan.id;

          return (
            <div
              key={plan.id}
              className={`border bg-card p-6 ${isCurrent ? "border-2 border-foreground" : "border-border"}`}
            >
              {isCurrent ? (
                <>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">Current plan</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{plan.name}</p>
                </>
              ) : (
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{plan.name}</p>
              )}

              <p className="mt-3 font-serif text-4xl text-foreground">
                ${plan.price.toFixed(2)}{" "}
                <span className="font-sans text-sm text-muted-foreground">/mo</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{plan.cadence}</p>

              <ul className="mt-6 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                    <FaCheck className="h-3 w-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  disabled
                  className="mt-6 w-full cursor-default rounded-md bg-secondary px-4 py-2.5 text-sm font-medium text-muted-foreground"
                >
                  You're on this plan
                </button>
              ) : (
                <button
                  onClick={() => handleSelect(plan)}
                  disabled={isLoading}
                  className="mt-6 w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isLoading
                    ? "Redirecting…"
                    : isDowngrade
                    ? "Downgrade"
                    : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SubscriptionSection;