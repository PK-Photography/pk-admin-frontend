import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const EmployeeProtectedRoute = () => {
  const role = localStorage.getItem("role");

  if (role === "employee") {
    return <Outlet />;
  } 

  else {
    return (
      <>
        <h1>You can't access this route!</h1>
      </>
    );
  }
};

export default EmployeeProtectedRoute;
