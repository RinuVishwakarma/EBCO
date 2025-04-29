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
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { toast, ToastContainer } from "react-toastify";

const ForgotPassword = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Email>();
  const router = useRouter();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const commonInputStyle = useCommonInputStyle();
  const ebcoBlueBorderButton = useEbcoBorderBlueButtonStyle();
  const ebcoDarkButton = useEbcoDarkBlueButtonStyle();
  const [emailSent, setEmailSent] = useState<Boolean>(false);
  const [email, setEmail] = useState<string>("");

  interface Email {
    email: string;
    path: string;
  }

  const sendEmail = async (data: Email) => {
    // try {
    const response = await apiClient.post<Email, string>(
      `${API_ENDPOINT.POST.getForgotPassword}`,
      {
        email: data.email,
        path: `${window.location.protocol}//${window.location.host}/reset-password`,
      }
    );
    return response;
    // } catch {
    //   console.error("Failed to send email:");
    // }
  };
  const mutationEmail = useMutation({
    mutationFn: sendEmail,
    onSuccess: (data) => {
      // console.log("reset", data)
      if (data) {
        reset();

        setEmailSent(true);
      }
    },
    onError: (error) => {
      // Handle error, e.g., show an error message to the user
      // console.error("Error fetching token:", error.message);
      if (error.message.includes("404")) {
        toast.error("Email not found", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          // transition: Bounce,
        });
      }
    },
  });
  const onSubmit: SubmitHandler<Email> = (data) => {
    // console.log(data.)
    setEmail(data.email);
    mutationEmail.mutate(data);
  };

  const handleBackRoute = () => {
    router.push("/login");
  };
  return (
    <Box
      className="column-center"
      sx={{
        width: "100%",
        padding: isSmallScreen ? "0" : "2rem",
        height: isSmallScreen ? "100%" : "fit-content",
      }}
      gap={2}
    >
      {emailSent ? (
        <VerifyEmail email={email} setEmailSent={setEmailSent} />
      ) : (
        <BoxShadowWrapper
          sx={{
            width: "100%",
            flex: 1,
            height: "80%",
            position: "relative",
            justifyContent: "space-evenly",
            padding: "2rem 0",
          }}
          className="column-space-between"
        >
          <Box className="column-space-around" flex={1}>
            <Image
              src={EbcoLogo}
              width={100}
              height={74}
              alt="ebco logo"
              style={{
                position: "relative",
                // margin
                // top: "1rem",
              }}
            />
            <Box
              className="column-center"
              sx={{
                marginBottom: isSmallScreen
                  ? "2rem !important"
                  : " 2rem !important",
                marginTop: '2rem'
              }}
            >
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Uniform Bold",
                  color: theme.palette.primary.dark,
                  margin: "1rem 0 !important",
                  textAlign: "center",
                }}
              >
                Forgot Password
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.disabled,
                  fontSize: "16px",
                  textAlign: "center",
                  width: "60%",
                }}
              >
                Enter your email address and we&apos;ll send you instructions to
                reset your password
              </Typography>
            </Box>
          </Box>

          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              width: isSmallScreen ? "95%" : "90%",
            }}
          >
            <Box
              sx={{
                margin: "1rem 0",
              }}
            >
              <Typography variant="h6" sx={useInputLabelStyle}>
                Email Address
              </Typography>
              <input
                type="email"
                placeholder="Email Address"
                style={commonInputStyle}
                {...register("email", {
                  required: true,
                  validate: (value) =>
                    (value && value.trim().length > 0) || "Enter email address",
                })}
              />
              {errors.email?.type === "required" && (
                <p role="alert" style={inputError}>
                  Email Address is required
                </p>
              )}
            </Box>
            <Box
              sx={{
                marginTop: "1rem",
              }}
            >
              <button type="submit" style={ebcoDarkButton}>
                Confirm Email
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
        </BoxShadowWrapper>
      )}
      <ToastContainer />
    </Box>
  );
};

export default ForgotPassword;
