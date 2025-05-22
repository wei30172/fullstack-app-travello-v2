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
  defaultSignInPage: "/signin",
  defaultErrorPage: "/error",
  defaultLoginRedirect: "/boards",
  defaultLogoutRedirect: "/signin"
}