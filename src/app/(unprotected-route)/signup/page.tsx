import ImageSection from "@/components/utils-components/ImageSection";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import SignUpContainer from "@/components/containers/SignUpContainer";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign Up",
  description:
    ""
};

const Signup = () => {

  return (
    <Box
      className="login-image-text-container"
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <SignUpContainer />
    </Box>
  );
};

export default Signup;
