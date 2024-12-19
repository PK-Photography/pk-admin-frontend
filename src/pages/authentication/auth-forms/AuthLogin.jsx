import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";

// material-ui
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

import toast, { Toaster } from "react-hot-toast";
// project import
import AnimateButton from "components/@extended/AnimateButton";

// assets
import EyeOutlined from "@ant-design/icons/EyeOutlined";
import EyeInvisibleOutlined from "@ant-design/icons/EyeInvisibleOutlined";
import Swal from "sweetalert2";
import axiosInstance from "utils/axiosInstance";

// ============================|| JWT - LOGIN ||============================ //

export default function AuthLogin({ isDemo = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false); // State to manage success alert visibility

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // const handleLogin = async (values, setErrors, setSubmitting) => {
  //   try {
  //     const response = await axiosInstance.post("/employees/login", {
  //       email: values.email,
  //       password: values.password,
  //     });

  //     if (response.data.status === "success") {
  //       // Store the accessToken in localStorage
  //       localStorage.setItem("accessToken", response.data.accessToken);
  //       localStorage.setItem("role", response.data.admin.role);

  //       // Show success alert
  //       setLoginSuccess(true);

  //       toast.success("Login Successfully!");
  //       if (response.data.status === "success") {
  //         navigate("/dashboard");
  //         return;
  //       }

  //       // console.log("Login successful");
  //     }
  //   } catch (error) {
  //     // console.error(error);

  //     setErrors({ submit: error.response?.data?.message || "Login failed" });
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };


  const handleLogin = async (values, setErrors, setSubmitting) => {
    try {
      const response = await axiosInstance.post("/admin/login", {
        email: values.email,
        password: values.password,
      });
  
      if (response.data.status === "success") {
        // Extract accessToken and admin details from the response
        const { accessToken, admin } = response.data;
  
        // Store the accessToken and admin email in localStorage
        localStorage.setItem("accessToken", accessToken);
        // localStorage.setItem("adminEmail", admin.email);
  
        // Show success toast notification
        toast.success("Login Successfully!");
  
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        throw new Error(response.data.message || "Unexpected response from the server");
      }
    } catch (error) {
      // Handle errors appropriately
      setErrors({ submit: error.response?.data?.message || "Login failed" });
      toast.error(error.response?.data?.message || "An error occurred during login");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <>
      {/* Show success alert if login is successful */}
      {loginSuccess && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          This is a success alert with an encouraging title.
        </Alert>
      )}

      <Formik
        initialValues={{
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={(values, { setErrors, setSubmitting }) => {
          setSubmitting(true);
          handleLogin(values, setErrors, setSubmitting);
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-email-login"
                  >
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? (
                            <EyeOutlined />
                          ) : (
                            <EyeInvisibleOutlined />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-password-login"
                  >
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}

              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Login
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };

// import PropTypes from "prop-types";
// import React from "react";
// import { Link as RouterLink } from "react-router-dom";
// import axios from "axios";

// // material-ui
// import Button from "@mui/material/Button";
// import FormHelperText from "@mui/material/FormHelperText";
// import Grid from "@mui/material/Grid";
// import Link from "@mui/material/Link";
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";
// import InputLabel from "@mui/material/InputLabel";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import Stack from "@mui/material/Stack";

// // third party
// import * as Yup from "yup";
// import { Formik } from "formik";
// import { useNavigate } from "react-router-dom";

// // project import
// import AnimateButton from "components/@extended/AnimateButton";

// // assets
// import EyeOutlined from "@ant-design/icons/EyeOutlined";
// import EyeInvisibleOutlined from "@ant-design/icons/EyeInvisibleOutlined";
// import axiosInstance from "utils/axiosInstance";
// import { Alert, AlertTitle } from "@mui/material";
// import toast from "react-hot-toast";

// // ============================|| JWT - LOGIN ||============================ //

// export default function AuthLogin({ isDemo = false }) {
//   const [showPassword, setShowPassword] = React.useState(false);
//   const navigate = useNavigate();

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   const handleLogin = async (values, setErrors, setSubmitting) => {
//     try {
//       const response = await axiosInstance.post("/auth/admin/login", {
//         email: values.email,
//         password: values.password,
//       });

//       if (response.data.status === "success") {
//         // Store the accessToken in localStorage
//         localStorage.setItem("accessToken", response.data.accessToken);

//         // Optionally, you can redirect or do something else here

//         if (response.data.status === "success") {
//           navigate("/dashboard");
//           return;
//         }
//         console.log("Login successful");
//       }
//     } catch (error) {
//       console.error(error);
//       setErrors({ submit: error.response?.data?.message || "Login failed" });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <Formik
//         initialValues={{
//           email: "",
//           password: "",
//           submit: null,
//         }}
//         validationSchema={Yup.object().shape({
//           email: Yup.string()
//             .email("Must be a valid email")
//             .max(255)
//             .required("Email is required"),
//           password: Yup.string().max(255).required("Password is required"),
//         })}
//         onSubmit={(values, { setErrors, setSubmitting }) => {
//           setSubmitting(true);
//           handleLogin(values, setErrors, setSubmitting);
//         }}
//       >
//         {({
//           errors,
//           handleBlur,
//           handleChange,
//           handleSubmit,
//           isSubmitting,
//           touched,
//           values,
//         }) => (
//           <form noValidate onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <Stack spacing={1}>
//                   <InputLabel htmlFor="email-login">Email Address</InputLabel>
//                   <OutlinedInput
//                     id="email-login"
//                     type="email"
//                     value={values.email}
//                     name="email"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     placeholder="Enter email address"
//                     fullWidth
//                     error={Boolean(touched.email && errors.email)}
//                   />
//                 </Stack>
//                 {touched.email && errors.email && (
//                   <FormHelperText
//                     error
//                     id="standard-weight-helper-text-email-login"
//                   >
//                     {errors.email}
//                   </FormHelperText>
//                 )}
//               </Grid>
//               <Grid item xs={12}>
//                 <Stack spacing={1}>
//                   <InputLabel htmlFor="password-login">Password</InputLabel>
//                   <OutlinedInput
//                     fullWidth
//                     error={Boolean(touched.password && errors.password)}
//                     id="-password-login"
//                     type={showPassword ? "text" : "password"}
//                     value={values.password}
//                     name="password"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     endAdornment={
//                       <InputAdornment position="end">
//                         <IconButton
//                           aria-label="toggle password visibility"
//                           onClick={handleClickShowPassword}
//                           onMouseDown={handleMouseDownPassword}
//                           edge="end"
//                           color="secondary"
//                         >
//                           {showPassword ? (
//                             <EyeOutlined />
//                           ) : (
//                             <EyeInvisibleOutlined />
//                           )}
//                         </IconButton>
//                       </InputAdornment>
//                     }
//                     placeholder="Enter password"
//                   />
//                 </Stack>
//                 {touched.password && errors.password && (
//                   <FormHelperText
//                     error
//                     id="standard-weight-helper-text-password-login"
//                   >
//                     {errors.password}
//                   </FormHelperText>
//                 )}
//               </Grid>
//               {errors.submit && (
//                 <Grid item xs={12}>
//                   <FormHelperText error>{errors.submit}</FormHelperText>
//                 </Grid>
//               )}
//               <Grid item xs={12}>
//                 <AnimateButton>
//                   <Button
//                     disableElevation
//                     disabled={isSubmitting}
//                     fullWidth
//                     size="large"
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                   >
//                     Login
//                   </Button>
//                 </AnimateButton>
//               </Grid>
//             </Grid>
//           </form>
//         )}
//       </Formik>
//     </>
//   );
// }

// AuthLogin.propTypes = { isDemo: PropTypes.bool };
