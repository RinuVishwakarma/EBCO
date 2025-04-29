"use client";
import BoxShadowWrapper from "@/components/utils-components/BoxShadowWrapper";
import { Box, colors, Input, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import EbcoLogo from "@/assets/ebcoDarkLogo.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { SignUp } from "@/interface/SignUp";
import { useTheme } from "@mui/material";
import {
  blackBorderButtonStyle,
  inputError,
  useCommonInputStyle,
  useEbcoDarkBlueButtonStyle,
  useInputLabelStyle,
  useEbcoBorderBlueButtonStyle,
} from "@/utils/CommonStyling";
import { useState } from "react";
import VerifyEmail from "@/components/module-components/VerifyEmail/VerifyEmail";
import { useRouter } from "next/navigation";
import CustomPhoneInput from "@/components/utils-components/CustomPhoneInput";
import "react-phone-number-input/style.css";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import GetTimerCountdown from "@/components/utils-components/GetTimerCountdown";
import OtpVerification from "@/components/module-components/OtpVerification/OtpVerification";

interface FormData {
  phone: string;
}
const LoginWithPhoneNumber = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const onSubmit: SubmitHandler<FormData> = (data) => {
    //console.log(data);
  };
  const router = useRouter();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const commonInputStyle = useCommonInputStyle();
  const ebcoBlueBorderButton = useEbcoBorderBlueButtonStyle();
  const ebcoDarkButton = useEbcoDarkBlueButtonStyle();
  const [otpSent, setOtpSent] = useState<Boolean>(false);
  const [value, setValue] = useState();

  const handleBackRoute = () => {
    router.push("/login");
  };
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
      {otpSent ? (
        <OtpVerification />
      ) : (
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
              top: "-1rem",
            }}
          />
          <Box
            className="column-space-between"
            sx={{
              height: isSmallScreen ? "auto" : "50%",
            }}
          >
            <Box className="column-center">
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Uniform Bold",
                  marginTop: "3rem",
                  color: theme.palette.primary.dark,
                  textAlign: "center",
                }}
              >
                Enter your phone number
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.disabled,
                  fontSize: "16px",
                  textAlign: "center",
                  width: "90%",
                }}
              >
                We will send you an One Time Password(OTP) on this mobile
                number.
              </Typography>
            </Box>

            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                display: "flex",
                flexDirection: "column",
                width: isSmallScreen ? "95%" : "80%",
              }}
            >
              <Box
                sx={{
                  margin: "1rem 0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ ...useInputLabelStyle, color: customColors.greyEbco }}
                >
                  Enter mobile no. *
                </Typography>
                {/* <input type="text" placeholder="Email Address"
                    style={commonInputStyle}
                        {...register("username", { required: true,validate: value =>
                    (value && value.trim().length > 0) ||
                    'Enter email address', },)} /> */}

                {/* {errors.userName?.type === "required" && (
                            <p role="alert" style={inputError}>Email Address is required</p>
                        )} */}

                <CustomPhoneInput
                  value=""
                  onChange={(value: string) => {
                    register("phone");
                  }}
                />
              </Box>
              <Box
                sx={{
                  marginTop: "2rem",
                }}
              >
                <button type="submit" style={ebcoDarkButton}>
                  Get Code
                </button>
                <button
                  type="submit"
                  style={{
                    ...ebcoBlueBorderButton,
                    marginTop: "1rem",
                  }}
                  onClick={handleBackRoute}
                >
                  Back
                </button>
              </Box>
            </form>
          </Box>
        </BoxShadowWrapper>
      )}
    </Box>
  );
};

export default LoginWithPhoneNumber;
