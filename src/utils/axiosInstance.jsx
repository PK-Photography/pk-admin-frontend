// import axios from "axios";
// const baseURL = "https://kindaspj.devapi.sarkariprivatejobs.com/api/v1";

// // Create an Axios instance
// const axiosInstance = axios.create({
//   baseURL,
//   headers: {
//     "x-spj-host": import.meta.env.VITE_APP_HOST,
//     "x-spj-key": import.meta.env.VITE_APP_KEY,
//   },
// });

// // Add a request interceptor to set the Authorization header and content type
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = localStorage.getItem("accessToken");

//     // If token exists, set it in the Authorization header
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }

//     // Check if the request data is an instance of FormData (for file upload)
//     if (config.data instanceof FormData) {
//       // Don't set Content-Type to allow the browser to set the boundary automatically for multipart/form-data
//       delete config.headers["Content-Type"];
//     } else {
//       // Set the content type to JSON for other requests
//       config.headers["Content-Type"] = "application/json";
//     }

//     return config;
//   },
//   (error) => {
//     // Handle request errors
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;



import axios from "axios";
import { handleLogout } from "../pages/authentication/Logout"; // Import your logout function
const baseURL = "http://localhost:8085/api/v1";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL,
  
});

// Add a request interceptor to set the Authorization header and content type
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    // If token exists, set it in the Authorization header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Check if the request data is an instance of FormData (for file upload)
    if (config.data instanceof FormData) {
      // Don't set Content-Type to allow the browser to set the boundary automatically for multipart/form-data
      delete config.headers["Content-Type"];
    } else {
      // Set the content type to JSON for other requests
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration or inaccessibility
axiosInstance.interceptors.response.use(
  (response) => {
    // Simply return the response if it's successful
    return response;
  },
  (error) => {
    // Check if the error response contains the "Token is not accessible!" message or BAD_REQUEST status
    if (
      error.response &&
      error.response.data &&
      error.response.data.message === "Token is not accessible!"
    ) {
      // Token is invalid or expired, trigger the logout
      handleLogout(); // Call your logout function here
      // Optionally, you can redirect the user to the login page
      window.location.href = "/login";
    }

    // Handle other errors (optional)
    return Promise.reject(error);
  }
);

export default axiosInstance;
