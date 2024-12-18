import { lazy } from "react";

// project import
import Loadable from "components/Loadable";
import MinimalLayout from "layout/MinimalLayout";

// render - login
const AuthLogin = Loadable(lazy(() => import("pages/authentication/login")));
const AuthRegister = Loadable(
  lazy(() => import("pages/authentication/register"))
);
const Logout = Loadable(lazy(() => import("pages/authentication/Logout")));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/login",
      element: <AuthLogin />,
    },
    {
      path: "/register",
      element: <AuthRegister />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
  ],
};

export default LoginRoutes;
