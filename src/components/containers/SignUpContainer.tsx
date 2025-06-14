import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Signup from "../module-components/Signup/Signup";

const SignUpContainer = () => {

  return (
    <Box
      sx={{
        height: "90vh",
      }}
      className="row-center  login-non-image-container"
    >
      <Signup />
    </Box>
  );
};

export default SignUpContainer;
