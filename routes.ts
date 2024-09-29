export const routes = {
  public: [
    "/",
    "/api/webhook/stripe",
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