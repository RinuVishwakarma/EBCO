"use client";
import BoxShadowWrapper from "@/components/utils-components/BoxShadowWrapper";
import { Box, colors, Input, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import EbcoLogo from "@/assets/ebcoDarkLogo.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { SignUp } from "@/interface/SignUp";
import { useTheme } from "@mui/material";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import {
  blackBorderButtonStyle,
  inputError,
  useCommonInputStyle,
  useEbcoDarkBlueButtonStyle,
  useInputLabelStyle,
  useEbcoBorderBlueButtonStyle,
  useOtpInput,
} from "@/utils/CommonStyling";
import OtpInput from "react-otp-input";
import { useState } from "react";
import GetTimerCountdown from "@/components/utils-components/GetTimerCountdown";

const OtpVerification = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUp>();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const commonInputStyle = useCommonInputStyle();
  const ebcoBlueBorderButton = useEbcoBorderBlueButtonStyle();
  const ebcoDarkButton = useEbcoDarkBlueButtonStyle();
  const otpInputStyle = useOtpInput();
  const onSubmit: SubmitHandler<SignUp> = (data) => {
    //console.log(data)
  };
  const phoneNumber = "+91 9876543210";
  const [otp, setOtp] = useState("");

  return (
    <Box
      className="column-center"
      sx={{
        width: "100%",
        padding: isSmallScreen ? "0" : "0 2rem",
        height: isSmallScreen ? "100%" : "90%",
      }}
      gap={2}
    >
      <BoxShadowWrapper
        sx={{
          width: "100%",
          flex: 1,
          height: "80%",
          position: "relative",
          justifyContent: "space-evenly",
        }}
        className="column-center"
      >
        <Image
          src={EbcoLogo}
          width={100}
          height={74}
          alt="ebco logo"
          style={{
            position: isMediumScreen ? "absolute" : "relative",
            top: "1rem",
          }}
        />

        <Box className="column-center">
          <Box
            className="column-center"
            sx={{
              margin: isSmallScreen ? "4rem 0" : "0",
            }}
          >
            <Typography
              variant="h5"
              style={{
                fontFamily: "Uniform Bold",
                margin: "2rem 0",
                color: theme.palette.primary.dark,
                textAlign: "center",
              }}
            >
              OTP Verification
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.disabled,
                fontSize: "16px",
                textAlign: "center",
                width: "100%",
              }}
            >
              Enter the code from the sms we have sent to{" "}
              <Typography
                sx={{
                  color: customColors.greyEbco,
                }}
              >
                {phoneNumber}
              </Typography>
            </Typography>

            <GetTimerCountdown />

            <OtpInput
              containerStyle={{ margin: "1rem 0" }}
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span> </span>}
              renderInput={(props) => <input {...props} />}
              inputStyle={otpInputStyle}
            />
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.disabled,
                fontSize: "16px",
                textAlign: "center",
                width: "100%",
                marginTop: "1rem",
              }}
            >
              I didn&apos;t receive any code.{" "}
              <span style={{ color: customColors.orangeEbco }}>RESEND</span>{" "}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: isSmallScreen ? "95%" : "80%",
            }}
          >
            <button style={{ ...ebcoDarkButton, margin: "1rem 0" }}>
              Enter Code
            </button>
            <button style={{ ...ebcoBlueBorderButton }}>Back</button>
          </Box>
        </Box>
      </BoxShadowWrapper>
    </Box>
  );
};

export default OtpVerification;
