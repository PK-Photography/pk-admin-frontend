import { RouterProvider } from "react-router-dom";
import "./App.css";

// project import
import router from "routes";
import ThemeCustomization from "themes";

import ScrollTop from "components/ScrollTop";
import { Toaster } from "react-hot-toast";

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <Toaster />
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
     
    </ThemeCustomization>
  );
}
