
// material-ui
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// project import
import AuthWrapper from "./AuthWrapper";
import AuthLogin from "./auth-forms/AuthLogin";
import Logo from "components/logo/LogoMain";

// ================================|| LOGIN ||================================ //

export default function Login() {
  return (
    <AuthWrapper>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={MainLogo}
          alt="main-logo"
          width="100"
          height="50"
          viewBox="0 0 118 35"
          fill="none"
        />
      </div> */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
            sx={{ mb: { xs: -0.5, sm: 0.5 } }}
          >
            <Typography variant="h3">Login</Typography>
            {/* <Typography
              component={Link}
              to="/register"
              variant="body1"
              sx={{ textDecoration: "none" }}
              color="primary"
            >
              Don&apos;t have an account?
            </Typography> */}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
