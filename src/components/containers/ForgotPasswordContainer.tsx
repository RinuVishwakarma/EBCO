"use client";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import ForgotPassword from "../module-components/ForgotPassword/ForgotPassword";
import { useState } from "react";

const ForgotPasswordContainer = () => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [emailSent, setEmailSent] = useState<Boolean>(false);

  return (
    <Box
      sx={{
        height: "90vh",
      }}
      className="row-center  login-non-image-container"
    >
      <ForgotPassword />
    </Box>
  );
};

export default ForgotPasswordContainer;
