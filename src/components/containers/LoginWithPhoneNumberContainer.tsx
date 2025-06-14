"use client";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import LoginWithPhoneNumber from "@/components/module-components/LoginWithPhoneNumber/LoginWithPhoneNumber";
import { useState } from "react";

const LoginWithPhoneNumberContainer = () => {
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
      <LoginWithPhoneNumber />
    </Box>
  );
};

export default LoginWithPhoneNumberContainer;
