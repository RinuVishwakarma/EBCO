"use client";
import React, { useEffect, useState } from "react";
import BoxShadowWrapper from "@/components/utils-components/BoxShadowWrapper";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTheme } from "@mui/material";
import "./Login.css";
import {
  inputError,
  useCommonInputStyle,
  useEbcoDarkBlueButtonStyle,
  useInputLabelStyle,
  useLinkStyle,
} from "@/utils/CommonStyling";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { setAuthToken } from "@/store/authReducer";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { setUrl } from "@/store/routeUrl";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { STORAGECONSTANTS } from "@/utils/constants/storageConstants";

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

interface Login {
  username: string;
  password: string;
}

const Login = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>();
  const theme = useTheme();
  const router = useRouter();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const commonInputStyle = useCommonInputStyle();
  const ebcoDarkButton = useEbcoDarkBlueButtonStyle();
  const linkStyle = useLinkStyle();
  const url = useAppSelector((state) => state.routeUrl);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  // const passwordRegex = /^(?=.*[a-z])(?=.*[\d\s\W]).{8,}$/;

  useEffect(() => {
    //console.log(url?.url, "login url");
  }, [url]);
  interface ErrorResponse {
    code: string;
    message: string;
    data: {
      status: number;
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
      return response;
    } catch (error: any) {
      return error.response.message;
    }
  };

  const mutation = useMutation({
    mutationFn: fetchToken,
    onSuccess: (data) => {
      document.body.classList.remove("loading");
      if (data?.token) {
        const tokenResponse: TokenResponse = {
          token: data.token,
          user_email: data.user_email,
          user_nicename: data.user_nicename,
          user_display_name: data.user_display_name,
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          roles: data.roles,
          registered_date: data.registered_date,
          billing_phone: data.billing_phone,
          billing_address_1: data.billing_address_1,
          billing_address_2: data.billing_address_2,
          gst_in: data.gst_in,
        };
        localStorage.setItem(STORAGECONSTANTS.AUTH_TOKEN, data.token);
        apiClient.SetToken(tokenResponse?.token!);
        dispatch(setAuthToken(tokenResponse));
        toast.success("Logged in successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        //console.log("url", url);
        let urlLocal = localStorage.getItem("url");

        if (urlLocal && urlLocal.length > 0) {
          router.push(urlLocal);
          dispatch(setUrl({ url: "" }));
          localStorage.removeItem("url");
        } else {
          router.push("/");
        }
      } else {
        setError("Invalid Credentials");
      }
    },
    onError: (error) => {
      document.body.classList.remove("loading");
      //console.log(error);
      setError("Invalid Credentials");
    },
  });

  const onSubmit: SubmitHandler<Login> = (data) => {
    document.body.classList.add("loading");
    mutation.mutate(data);
  };

  const passwordValidationRegex =
    /^(?=.*[a-z])(?=.*[0-9\s!@#$%^&*(),.?":{}|<>])[A-Za-z0-9\s!@#$%^&*(),.?":{}|<>]{8,}$/;

  return (
    <>
      {mutation.isPending && (
        <Box className="loader-container">
          <Box className="loader"></Box>
        </Box>
      )}
      <Box
        className="column-center login-wrapper"
        sx={{ width: "100%" }}
        gap={1}
      >
        <BoxShadowWrapper
          sx={{
            width: "100%",
            flex: 1,
            height: "100%",
            position: "relative",
          }}
          className="column-center"
        >
          <Box
            sx={{ width: "90%", height: "100%" }}
            className="column-space-between"
          >
            <Image
              src={"/images/ebcoDarkLogo.svg"}
              width={100}
              height={74}
              alt="ebco logo"
              style={{ top: "1rem" }}
            />
            <Typography
              variant="h5"
              style={{
                fontFamily: "Uniform Bold",
                color: customColors.darkBlueEbco,
                margin: "1rem 0 !important",
                marginBottom: "5rem !important",
              }}
            >
              Log In Account
            </Typography>
            {error && (
              <p
                role="alert"
                style={{ ...inputError, font: "20px !important" }}
              >
                {error}
              </p>
            )}
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{
                display: "flex",
                flexDirection: "column",
                width: isSmallScreen ? "95%" : "100%",
              }}
            >
              <Box sx={{ margin: "1rem 0" }}>
                <Typography variant="h6" sx={useInputLabelStyle}>
                  Username
                </Typography>
                <input
                  type="text"
                  placeholder="Username"
                  style={commonInputStyle}
                  {...register("username", {
                    required: true,
                    validate: (value) =>
                      (value && value.trim().length > 0) || "Enter Username",
                  })}
                />
                {errors.username?.type === "required" && (
                  <p role="alert" style={inputError}>
                    Username is required
                  </p>
                )}
              </Box>

              <Box sx={{ margin: "1rem 0" }}>
                <Typography variant="h6" sx={useInputLabelStyle}>
                  Password
                </Typography>
                {/* <input
                  type="password"
                  placeholder="Password"
                  style={commonInputStyle}
                  {...register("password", {
                    required: true,
                    validate: (value) =>
                      passwordValidationRegex.test(value) || "Invalid Password",
                  })}
                /> */}
                <Box sx={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    style={commonInputStyle}
                    {...register("password", {
                      required: true,
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
                {/* {errors.password?.message && (
                  <p role="alert" style={inputError}>
                    {errors.password.message}
                  </p>
                )} */}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "2rem",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: customColors.orangeEbco,
                    fontSize: "16px",
                    cursor: "pointer",
                    fontFamily: "Uniform Medium",
                  }}
                >
                  <Link  prefetch={false} href="/forgot-password" style={linkStyle}>
                    Forgot Password
                  </Link>
                </Typography>
              </Box>

              <button type="submit" style={ebcoDarkButton}>
                Sign In
              </button>
            </form>
            {isSmallScreen && (
              <Box sx={{ display: "flex", marginTop: "1rem" }}>
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.text.disabled, fontSize: "16px" }}
                >
                  Don&apos;t have an account?{" "}
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
                  <Link  prefetch={false} href="/signup" style={linkStyle}>
                    Sign Up
                  </Link>
                </Typography>
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
              Don&apos;t have an account?{" "}
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
              <Link  prefetch={false} href="/signup" style={linkStyle}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        )}
      </Box>
      <ToastContainer />
    </>
  );
};

export default Login;
