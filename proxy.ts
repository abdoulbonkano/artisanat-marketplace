import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const role = req.auth?.user?.role;

  if (nextUrl.pathname.startsWith("/vendeur")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/auth/connexion", nextUrl));
    }
    if (role !== "SELLER" && role !== "ADMIN") {
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
