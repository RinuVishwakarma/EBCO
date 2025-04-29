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
  useLinkStyle,
} from "@/utils/CommonStyling";
import Link from "next/link";
import { link } from "fs";
import { useRouter } from "next/navigation";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { Login } from "@/interface/Login";
import { setAuthToken } from "@/store/authReducer";
import { useAppDispatch } from "@/store/reduxHooks";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./Signup.css";
import { Bounce, ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { STORAGECONSTANTS } from "@/utils/constants/storageConstants";
const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUp>();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const router = useRouter();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const commonInputStyle = useCommonInputStyle();
  const ebcoDarkButton = useEbcoDarkBlueButtonStyle();
  const linkStyle = useLinkStyle();
  const [error, setError] = useState<string | null>(null);
  const passwordRegex = /^(?=.*[a-z])(?=.*[\d\s\W]).{8,}$/;

  interface TokenResponse {
    token: string;
    user_email: string;
    user_nicename: string;
    user_display_name: string;
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    roles: string;
    registered_date: string;
    billing_address_1: string;
    billing_address_2: string;
    billing_phone: string;
    gst_in: string;
  }
  interface UserRegistrationResponse {
    message: string;
    data: {
      ID: string;
      user_login: string;
      user_pass: string;
      user_nicename: string;
      user_email: string;
      user_url: string;
      user_registered: string;
      user_activation_key: string;
      user_status: string;
      display_name: string;
    };
  }
  const fetchToken = async (data: Login) => {
    try {
      const response = await apiClient.post<Login, TokenResponse>(
        API_ENDPOINT.POST.get_token,
        {
          username: data.username,
          password: data.password,
        }
      );
      // //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response;
    } catch { }
  };
  const signUp = async (data: SignUp) => {
    try {
      const response = await apiClient.post<SignUp, UserRegistrationResponse>(
        API_ENDPOINT.POST.signup,
        {
          first_name: data.first_name,
          password: data.password,
          email: data.email,
        }
      );
      console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response;
    } catch { }
  };
  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: async (data) => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      document.body.classList.remove("loading");
      console.log(data);

      if (data !== undefined && data?.message === "User registered successfully.") {
        //console.log(data, "data from sign up");
        const loginData: Login = {
          username: data.data.user_login,
          password: password, // Use the stored password
        };

        try {
          const tokenResponse = await fetchToken(loginData);
          //console.log(tokenResponse, "token response");
          toast.success("Signed up successfully!", {
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
          localStorage.setItem(
            STORAGECONSTANTS.AUTH_TOKEN,
            tokenResponse?.token!
          );
          apiClient.SetToken(tokenResponse?.token!);
          dispatch(setAuthToken(tokenResponse!));
          router.push("/");
        } catch (error) {
          setError("Error fetching token");
        }
      } else {
        toast.error("Email already exists. Please try logging in.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setError("Invalid Credentials");

      }
    },
    onError: (error) => {
      // Handle error, e.g., show an error message to the user
      console.error("Error fetching token:", error);
    },
  });

  const onSubmit: SubmitHandler<SignUp> = (data) => {
    setPassword(data.password);
    document.body.classList.add("loading");
    mutation.mutate(data);
  };
  useEffect(() => {
    //console.log(errors);
  }, [errors]);
  return (
    <>
      {mutation.isPending && (
        <Box className="loader-container">
          <Box className="loader"></Box>
        </Box>
      )}
      <Box
        className="column-space-between signup-container"
        sx={{
          width: "100%",
          padding: isSmallScreen ? "0" : "2rem",
          height: isSmallScreen ? "100%" : "90%",
        }}
        gap={1}
      >
        <BoxShadowWrapper
          sx={{
            width: "100%",
            flex: 1,
            height: "90vh",
            position: "relative",
          }}
          className="column-center"
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
            }}
            className="column-space-between"
          >
            <Image
              src={EbcoLogo}
              width={100}
              height={74}
              style={{
                // position:isMediumScreen?'absolute':'relative',
                top: "1rem",
              }}
              alt="ebco logo"
            />
            <Typography
              variant="h5"
              style={{
                fontFamily: "Uniform Bold",
                color: customColors.darkBlueEbco,
              }}
            >
              Create An Account
            </Typography>

            <Box
              sx={{
                width: "90%",
              }}
            >
              {/* <Box
              sx={blackBorderButtonStyle}
              onClick={() => {
                router.push("/login-with-phone-number");
              }}
            >
              <Image
                src={"/images/smartphone.svg"}
                alt="smartphone"
                width={24}
                height={24}
              />
              <Typography
                variant="h6"
                style={{
                  fontFamily: "Uniform Medium",
                  fontSize: "1rem",
                  color: theme.palette.primary.dark,
                }}
              >
                Login with OTP
              </Typography>
            </Box> */}
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
                  margin: "0.5rem 0",
                }}
              >
                <Typography variant="h6" sx={useInputLabelStyle}>
                  Enter Full Name
                </Typography>
                <input
                  type="text"
                  placeholder="Full Name"
                  style={commonInputStyle}
                  {...register("first_name", {
                    required: true,
                    validate: (value) =>
                      (value && value.trim().length > 0) || "Enter full name",
                  })}
                />

                {errors.first_name?.type === "required" && (
                  <p role="alert" style={inputError}>
                    Full name is required
                  </p>
                )}
              </Box>

              <Box
                sx={{
                  margin: "0.5rem 0",
                }}
              >
                <Typography variant="h6" sx={useInputLabelStyle}>
                  Email Address
                </Typography>
                <input
                  type="text"
                  placeholder="Email Address"
                  style={commonInputStyle}
                  {...register("email", {
                    required: true,
                    validate: (value) =>
                      (value && value.trim().length > 0) ||
                      "Enter email address",
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
                  margin: "0.5rem 0",
                }}
              >
                <Typography variant="h6" sx={useInputLabelStyle}>
                  Password
                </Typography>
                <Box sx={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    style={commonInputStyle}
                    {...register("password", {
                      required: "Password is required",
                      validate: {
                        regex: (value) =>
                          passwordRegex.test(value) ||
                          "Password must be at least 8 characters long, include at least one lowercase letter, and at least one number, symbol, or whitespace character",
                      },
                    })}
                  />
                  {!showPassword ? (
                    <Visibility
                      className="passwordIcon"
                      onClick={() => setShowPassword(true)}
                    />
                  ) : (
                    <VisibilityOff
                      className="passwordIcon"
                      onClick={() => setShowPassword(false)}
                    />
                  )}
                </Box>
                {errors.password?.type === "required" && (
                  <p role="alert" style={inputError}>
                    Password is required
                  </p>
                )}
                {errors.password?.type === "regex" && (
                  <>
                    <p role="alert" style={inputError}>
                      Password must be at least 8 characters long
                    </p>
                    <p role="alert" style={inputError}>
                      Include at least one lowercase letter
                    </p>
                    <p role="alert" style={inputError}>
                      Include at least one number, symbol, or whitespace
                      character
                    </p>
                  </>
                )}
              </Box>

              <button
                type="submit"
                style={{ ...ebcoDarkButton, marginTop: "1.5rem" }}
              >
                Sign Up
              </button>
            </form>
            {isSmallScreen && (
              <Box
                sx={{
                  display: "flex",
                  marginTop: "1rem",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.text.disabled, fontSize: "16px" }}
                >
                  Do you have an Account?{" "}
                </Typography>
                <Link  prefetch={false} href="/login" style={linkStyle}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "16px",
                      marginLeft: "5px",
                    }}
                  >
                    Sign In
                  </Typography>
                </Link>
              </Box>
            )}
          </Box>
        </BoxShadowWrapper>
        {!isSmallScreen && (
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: theme.palette.text.disabled, fontSize: "16px" }}
            >
              Do you have an Account?{" "}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "16px",
                marginLeft: "5px",
                textDecoration: "none",
              }}
            >
              <Link  prefetch={false} href="/login" style={linkStyle}>
                Sign In
              </Link>
            </Typography>
          </Box>
        )}
      </Box>
      <ToastContainer />
    </>
  );
};

export default Signup;
