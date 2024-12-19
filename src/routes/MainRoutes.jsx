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
// import AdminManage from "pages/AdminManage";
// import MasterProtecterRoute from "./MasterProtecterRoute";
// import EmployeeManagement from "pages/EmployeeManagement";
// import ManageDepartment from "pages/ManageDepartment";
// import Attendance from "pages/Attendance";
// import EmployeeDetails from "pages/EmployeeDetails";
// import Leave from "pages/Leave";
// import ApplyLeaves from "pages/ApplyLeaves";
// import EmployeeProtectedRoute from "./EmployeeProtectedRoute";

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
          element: <Clients />, // Dashboard page
        },
    
        {
          path: "admin-management",
          element: <AdminManage />, // Dashboard page
        },
        {
          path: "/home-page-carousel",
          element: <HomePageCarousel />, // Dashboard page
        },
        {
          path: "/reviews",
          element: <Reviews />, // Dashboard page
        },
    
      
    
       
    
        // Admin management section wrapped by MasterProtecterRoute
        // {
        //   element: <MasterProtecterRoute />, // Wrapping this section with MasterProtecterRoute
        //   children: [
        //     {
        //       path: "admin-management",
        //       element: <AdminManage />, // Admin management page
        //     },
        //     {
        //       path: "employee-management",
        //       element: <EmployeeManagement />, // Dashboard page
        //     },
        //     {
        //       path: "/manage-department",
        //       element: <ManageDepartment/>, // Dashboard page
        //     },
        //     {
        //       path: "/employees-deatails",
        //       element: <EmployeeDetails/>, // Dashboard page
        //     },
        //     {
        //       path: "/attendance",
        //       element: <Attendance/>, // Dashboard page
        //     },
        //     {
        //       path: "/manage-leaves",
        //       element: <Leave />, // Dashboard page
        //     },
        //     {
        //       path: "/dashboard/manage-leaves",
        //       element: <Leave />, // Dashboard page
        //     },
        //   ],
        // },
        // {
        //   element: <EmployeeProtectedRoute />, // Wrapping this section with MasterProtecterRoute
        //   children: [
        //     {
        //       path: "apply-leave",
        //       element: <ApplyLeaves />, // Dashboard page
        //     },
        
           
          
        //   ],
        // },
      ],
    },
  ],
};

export default MainRoutes;
