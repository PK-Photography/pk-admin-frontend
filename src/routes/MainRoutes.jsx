import { lazy } from "react";
import { Outlet } from "react-router-dom";

// project import
import Loadable from "components/Loadable";
import Dashboard from "layout/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Bookings from "pages/Bookings";
import Clients from "pages/Clients";
import AdminManage from "pages/AdminManage";
import HomePageCarousel from "pages/HomePageCarousel";
import Reviews from "pages/Reviews";
import Gallary from "pages/Gallary";
import Blogs from "pages/Blogs";
import UserManagement from "pages/UserManagement";
import JobApplication from "pages/jobApplication";
import Services from "pages/Services";
import SubServices from "pages/subService";

// Lazy loading of the components
const Color = Loadable(lazy(() => import("pages/component-overview/color")));
const Typography = Loadable(
  lazy(() => import("pages/component-overview/typography"))
);
const Shadow = Loadable(lazy(() => import("pages/component-overview/shadows")));
const DashboardDefault = Loadable(lazy(() => import("pages/dashboard/index")));

// Main routes configuration

const MainRoutes = {
  element: <ProtectedRoute />, // Wrapping all routes with ProtectedRoute
  children: [
    {
      path: "/", // Dashboard layout
      element: <Dashboard />,
      children: [
        {
          path: "/",
          element: <DashboardDefault />, // Default dashboard route
        },
        {
          path: "dashboard",
          element: <DashboardDefault />, // Dashboard page
        },
        {
          path: "dashboard/:id",
          element: <DashboardDefault />, // Dashboard page
        },

        {
          path: "manage-bookings",
          element: <Bookings />, // Dashboard page
        },
        {
          path: "clients",
          element: <Clients />,
        },
        {
          path: "user-management",
          element: <UserManagement />,
        },

        {
          path: "admin-management",
          element: <AdminManage />,
        },
        {
          path: "/home-page-carousel",
          element: <HomePageCarousel />,
        },
        {
          path: "/manage-gallary",
          element: <Gallary />,
        },
        {
          path: "/blogs",
          element: <Blogs />,
        },
        {
          path: "/reviews",
          element: <Reviews />,
        },
         {
          path: "/jobApplication",
          element: <JobApplication />,
        },
         {
          path: "/services",
          element: <Services />,
        },
         {
          path: "/subServices",
          element: <SubServices />,
        },

      ],
    },
  ],
};

export default MainRoutes;