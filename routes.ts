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
  defaultLoginRedirect: "/boards",
  defaultLogoutRedirect: "/signin"
}