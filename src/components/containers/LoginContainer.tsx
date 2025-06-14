import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Login from "../module-components/Login/Login";

const LoginContainer = () => {

  return (
    <Box
      sx={{
        height: "90vh",
      }}
      className="row-center login-non-image-container"
    >
      <Login />
    </Box>
  );
};

export default LoginContainer;
