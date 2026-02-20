import React from "react";
import { Outlet } from "react-router-dom";

/**
 * Wrapper for Manage Gallery routes (gallery list, edit-homepage, service images).
 * All authenticated users can access; no role restriction.
 */
const AdminGalleryRoute = () => {
  return <Outlet />;
};

export default AdminGalleryRoute;
