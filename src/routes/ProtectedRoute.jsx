import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (accessToken) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;

// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedAdminRoute = () => {
//   const [auth] = useAuth();
//   if (auth.user && auth.user.role === "admin") {
//     return <Outlet />;
//   } else {
//     return <Navigate to="/" />;
//   }
// };

// export default ProtectedAdminRoute;
