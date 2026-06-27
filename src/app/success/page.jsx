"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getToken } from "@/lib/auth-client"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL

const SuccessContent = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const { data: session } = authClient.useSession()
  const user = session?.user

  const [status, setStatus] = useState("verifying")
  const [type, setType] = useState(null)

  useEffect(() => {
    if (!sessionId) {
      setStatus("error")
      return
    }

    const verify = async () => {
      const token = await getToken()
      if (!token) {
        setStatus("error")
        return
      }

      const res = await fetch(`${SERVER}/api/stripe/verify-session`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      })

      if (res.ok) {
        const data = await res.json()
        setType(data.type)
        setStatus("success")
      } else {
        setStatus("error")
      }
    }

    verify()
  }, [sessionId])

  const dashboardHref = user ? `/dashboard/${user.role}` : "/"

  return (
    <div className="bg-background min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <p className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
              Please wait
            </p>
            <h1 className="font-serif text-4xl text-foreground">
              Confirming payment…
            </h1>
            <p className="mt-4 font-sans text-sm text-muted-foreground">
              We're verifying your transaction.
            </p>
          </>
        )}

        {status === "success" && type === "artwork" && (
          <>
            <p className="font-sans text-[11px] uppercase tracking-widest text-primary mb-4">
              Purchase confirmed
            </p>
            <h1 className="font-serif text-4xl text-foreground">
              The work is yours.
            </h1>
            <p className="mt-4 font-sans text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your artwork has been added to your gallery. You can view it in your collector dashboard.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href={dashboardHref}
                className="bg-foreground px-6 py-3 font-sans text-sm font-medium uppercase tracking-widest text-background transition-opacity hover:opacity-90"
              >
                Go to dashboard
              </Link>
              <Link
                href="/browse"
                className="border border-border px-6 py-3 font-sans text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-secondary"
              >
                Browse more
              </Link>
            </div>
          </>
        )}

        {status === "success" && type === "subscription" && (
          <>
            <p className="font-sans text-[11px] uppercase tracking-widest text-primary mb-4">
              Plan activated
            </p>
            <h1 className="font-serif text-4xl text-foreground">
              Your plan is live.
            </h1>
            <p className="mt-4 font-sans text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your subscription has been upgraded. Start collecting more works right away.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href={dashboardHref}
                className="bg-foreground px-6 py-3 font-sans text-sm font-medium uppercase tracking-widest text-background transition-opacity hover:opacity-90"
              >
                Go to dashboard
              </Link>
              <Link
                href="/browse"
                className="border border-border px-6 py-3 font-sans text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-secondary"
              >
                Browse artworks
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <p className="font-sans text-[11px] uppercase tracking-widest text-destructive mb-4">
              Something went wrong
            </p>
            <h1 className="font-serif text-4xl text-foreground">
              We couldn't confirm your payment.
            </h1>
            <p className="mt-4 font-sans text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your card may not have been charged. Please check your dashboard or contact support.
            </p>
            <div className="mt-8">
              <Link
                href={dashboardHref}
                className="bg-foreground px-6 py-3 font-sans text-sm font-medium uppercase tracking-widest text-background transition-opacity hover:opacity-90"
              >
                Go to dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const SuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="bg-background min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <p className="font-sans text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
              Please wait
            </p>
            <h1 className="font-serif text-4xl text-foreground">
              Confirming payment…
            </h1>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}

export default SuccessPage