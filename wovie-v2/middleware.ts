export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/movies/:path*", "/profile/:path*", "/search/:path*", "/watchlists/:path*"],
};
