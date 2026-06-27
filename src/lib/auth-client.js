import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://art-hub-client-two.vercel.app",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, useSession } = authClient;


export const getToken = async () => {
  try {
    const res = await fetch("https://art-hub-client-two.vercel.app/api/auth/token", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token ?? null;
  } catch {
    return null;
  }
};