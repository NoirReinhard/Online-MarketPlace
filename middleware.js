// app/middleware.js or middleware.js
export function middleware() {
  // if you want to use token-based logic, use next-auth's getToken here
  return Response.next();
}

// optional config if you want to limit paths
export const config = {
  matcher: ["/dashboard/:path*"], // or whatever protected routes
};
