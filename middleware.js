/** @format */

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  if (req.nextUrl.pathname === "/") {
    const token = await getToken({
      req,
      secret: process.env.JWT_SECRET,
      raw: true,
    });
    if (req.nextUrl.pathname.includes("/api/auth") || token) {
      return NextResponse.next();
    }
    if (!token && req.nextUrl.pathname !== "/login") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    // You could also check for any property on the session object,
    // like role === "admin" or name === "John Doe", etc.
    // if (!session) {
    //   const url = req.nextUrl.clone();
    //   url.pathname = "/login";
    //   return NextResponse.redirect(url);
    // }

    // If user is authenticated, continue.
  }
}
export const config = {
  matcher: ["/"],
};
