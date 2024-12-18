// import React, { useState, useEffect, useContext, createContext } from "react";
// import axios from "axios";

// const AuthContext = createContext();
// const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     user: null,
//     token: "",
//   });

//   useEffect(() => {
//     axios.defaults.headers.common["Authorization"] = auth?.token;
//   }, [auth.token]);

//   useEffect(() => {
//     const data = localStorage.getItem("accessToken");
//     const user = localStorage.getItem("user");

//     if (data === "undefined") {
//       localStorage.setItem("accessToken", JSON.stringify(" "));
//       return;
//     }

//     if (data) {
//       const parseData = JSON.parse(data);
//       setAuth((prevAuth) => ({
//         ...prevAuth,
//         token: parseData,
//       }));
//     }

//     if (user) {
//       const parseData = JSON.parse(user);
//       setAuth((prevAuth) => ({
//         ...prevAuth,
//         user: parseData,
//       }));
//     }
//   }, [auth.token]);

//   return (
//     <AuthContext.Provider value={[auth, setAuth]}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // custom hook
// const useAuth = () => useContext(AuthContext);

// export { useAuth, AuthProvider };

import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  useEffect(() => {
    // Set Authorization header for axios with token
    axios.defaults.headers.common["Authorization"] = `Bearer ${auth?.token}`;
  }, [auth.token]);

  useEffect(() => {
    // Retrieve token and user from localStorage
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (token === "undefined" || !token) {
      localStorage.setItem("accessToken", "");
      return;
    }

    // Set token directly without parsing
    if (token) {
      setAuth((prevAuth) => ({
        ...prevAuth,
        token,
      }));
    }

    // Parse and set the user data
    if (user) {
      const parseUser = JSON.parse(user);
      setAuth((prevAuth) => ({
        ...prevAuth,
        user: parseUser,
      }));
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
