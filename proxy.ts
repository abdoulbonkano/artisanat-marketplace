import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const role = req.auth?.user?.role;

  // Server Actions (POST) already enforce auth/role server-side via
  // requireUser/requireSeller/requireAdmin, which read a fresh role from the
  // database. This proxy only needs to gate GET navigation before render —
  // applying it to POSTs risks racing/overriding the action's own redirect
  // response with a stale edge-decoded role.
  if (req.method !== "GET") {
    return;
  }

  if (nextUrl.pathname.startsWith("/vendeur")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/auth/connexion", nextUrl));
    }
    // /vendeur/onboarding is how a BUYER becomes a SELLER — it must stay
    // reachable to any logged-in user, only the dashboard itself is gated.
    const isOnboarding = nextUrl.pathname.startsWith("/vendeur/onboarding");
    if (!isOnboarding && role !== "SELLER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/auth/connexion", nextUrl));
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }
});

export const config = {
  matcher: ["/vendeur/:path*", "/admin/:path*"],
};
