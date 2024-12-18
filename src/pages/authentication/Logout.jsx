// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Button,
// } from "@mui/material";
// import toast, { Toaster } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "contexts/AuthContext";

// const Logout = () => {
//   const [auth, setAuth] = useAuth();
//   const [open, setOpen] = useState(false); // State to manage dialog visibility
//   const navigate = useNavigate(); // Hook for navigation

//   // Function to open the dialog
//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   // Function to close the dialog
//   const handleClose = () => {
//     setOpen(false);
//   };

//   // Function to handle logout
//   const handleLogout = () => {
//     // Clear the auth state and local storage
//     setAuth({
//       ...auth,
//       user: null,
//       token: "",
//     });
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("role");

//     // Show success toast
//     toast.success("Logged out successfully!");

//     // Navigate to the login page
//     navigate("/login");
//   };

//   return (
//     <div>
//       <Button variant="contained" color="primary" onClick={handleClickOpen}>
//         Logout
//       </Button>

//       {/* Confirmation Dialog */}
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           {"Are you sure you want to logout?"}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Logging out will clear your session and require you to log in again
//             to access the app.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary">
//             Cancel
//           </Button>
//           <Button
//             onClick={() => {
//               handleLogout();
//               handleClose();
//             }}
//             color="secondary"
//             autoFocus
//           >
//             Logout
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Toast Notifications */}
//       <Toaster />
//     </div>
//   );
// };

// export default Logout;

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import { useAuth } from "contexts/AuthContext";

export const handleLogout = () => {
  const auth = JSON.parse(localStorage.getItem("auth")) || {}; // Read from localStorage if outside component

  // Clear the auth state and local storage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("role");

  // Show success toast (this won't work outside React component, so you might skip this)
  toast.success("Logged out successfully!");

  // Navigate to the login page
  window.location.href = "/login"; // Use window.location.href for redirection
};

const Logout = () => {
  const [auth, setAuth] = useAuth();
  const [open, setOpen] = useState(false); // State to manage dialog visibility
  const navigate = useNavigate(); // Hook for navigation

  // Function to open the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Check if the token has expired
  const checkTokenExpiration = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decodedToken.exp < currentTime) {
          // Token has expired, perform logout
          handleLogout();
        } else {
          // Set a timeout to auto-logout when token expires
          const timeUntilExpiration = (decodedToken.exp - currentTime) * 1000; // Convert to milliseconds
          setTimeout(() => {
            handleLogout();
          }, timeUntilExpiration);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };

  useEffect(() => {
    checkTokenExpiration(); // Check token expiration on component mount
  }, []);

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Logout
      </Button>

      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to logout?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Logging out will clear your session and require you to log in again
            to access the app.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleLogout();
              handleClose();
            }}
            color="secondary"
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
};

export default Logout;
