"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

function FormField({ label, id, ...props }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full rounded-md border border-border bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
      />
    </div>
  );
}

function validatePassword(value) {
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(value)) return "Add at least one uppercase letter.";
  if (!/[a-z]/.test(value)) return "Add at least one lowercase letter.";
  if (!/[0-9]/.test(value)) return "Add at least one number.";
  return null;
}
const SignUpPage = () => {
  const router = useRouter();
  const [role, setRole] = useState("collector");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.fullName.trim().length < 3) {
      toast.error("Name must be at least 3 characters.");
      return;
    }
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await authClient.signUp.email({
      email: form.email,
      password: form.password,
      name: form.fullName,
      role,
    });
    setIsSubmitting(false);

    if (data) {
      toast.success("Registration successful! Please sign in.");
      router.push("/signin");
    }
    if (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-18 py-16 lg:grid-cols-2">
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Join the studio
        </p>
        <h1 className="font-serif text-4xl leading-[1.1] text-foreground md:text-5xl">
          Where art finds its home.
        </h1>
        <p className="mt-5 max-w-sm text-sm text-muted-foreground">
          Collect original works, follow studios you love, or open your own —
          whichever brought you here, you&apos;re welcome.
        </p>
        <div className="relative mt-10 aspect-square w-full max-w-md overflow-hidden">
          <Image
            src="https://i.ibb.co.com/CKbX3JbK/imagesignup.avif"
            alt="Featured artwork"
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="w-full max-w-md justify-self-start lg:justify-self-end">
        <h2 className="font-serif text-2xl text-foreground">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Already have one?{" "}
          <Link href="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>

        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            I am a
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "collector", title: "Collector", subtitle: "Browse & buy" },
              { id: "artist", title: "Artist", subtitle: "Sell my work" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setRole(option.id)}
                aria-pressed={role === option.id}
                className={`rounded-md border px-4 py-3 text-left transition-colors ${
                  role === option.id
                    ? "border-foreground"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <span className="flex items-center justify-between text-sm font-medium text-foreground">
                  {option.title}
                  {role === option.id && (
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-xs text-muted-foreground">
                  {option.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0012 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1A6.6 6.6 0 015.5 12c0-.73.13-1.43.34-2.1V7.06H2.18A10.99 10.99 0 001 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A10.99 10.99 0 002.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Or
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            label="Full name"
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Mira Holloway"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <FormField
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="you@studio.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="8+ chars, upper, lower & a number"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-border bg-transparent px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? (
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a9.96 9.96 0 014.412 1.018M21 12c-.512.875-1.21 1.766-2.067 2.55M3 3l18 18"
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
                      d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <FormField
            label="Confirm password"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-foreground px-4 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>

          <p className="text-xs text-muted-foreground">
            By continuing you agree to ArtHub&apos;s{" "}
            <Link
              href="/terms"
              className="text-foreground underline underline-offset-2"
            >
              terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-foreground underline underline-offset-2"
            >
              privacy policy
            </Link>
            .
          </p>
        </form>
      </div>
    </main>
  );
};

export default SignUpPage;
