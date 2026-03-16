import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));

  response.cookies.set("pelotus_user", "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  response.cookies.set("pelotus_token", "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });

  return response;
}
