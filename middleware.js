// export { default } from "next-auth/middleware";

import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;
    const myUserId = token?.user?._id;

    const paths = [
      `/profile/${myUserId}/favorite`,
      `/profile/${myUserId}/private`,
    ];

    if (!paths.includes(pathname) && pathname.startsWith("/profile")) {
      return new NextResponse("You are not authorized");
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/upload/:path*/",
    "/profile/:path*/private",
    "/profile/:path*/favorite",
    "/search/private/:path*",
  ],
};
