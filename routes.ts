export const routes = {
  public: [
    "/",
    "/new-verification",
    "/accept-invitation"
  ],
  auth: [
    "/signin",
    "/signup",
    "/reset",
    "/new-password",
    "/error"
  ],
  apiAuthPrefix: "/api/auth",
  defaultLoginRedirect: "/boards",
  defaultLogoutRedirect: "/signin"
}