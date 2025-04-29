"use client";
import React, { useEffect, useState } from "react";
import BoxShadowWrapper from "@/components/utils-components/BoxShadowWrapper";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useTheme } from "@mui/material";
import "./ResetPassword.css";
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
import { useSearchParams } from "next/navigation";

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
interface ResetPassword {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPassword>();
  const theme = useTheme();
  const router = useRouter();
  const newPassword = watch("password", "");
  const params = useSearchParams();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const commonInputStyle = useCommonInputStyle();
  const ebcoDarkButton = useEbcoDarkBlueButtonStyle();
  const linkStyle = useLinkStyle();
  const url = useAppSelector((state) => state.routeUrl);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [key, setKey] = useState<string>("");
  const [loginKey, setLoginKey] = useState<string>("");

  // const passwordRegex = /^(?=.*[a-z])(?=.*[\d\s\W]).{8,}$/;

  useEffect(() => {
    let key = params.get("key");
    let loginKey = params.get("login");
    if (key && loginKey) {
      setKey(key);
      setLoginKey(loginKey);
      //console.log(key, loginKey);
      window.history.pushState(null, "", `${window.location.pathname}`);
    }
  }, []);
  interface ErrorResponse {
    code: string;
    message: string;
    data: {
      status: number;
    };
  }
  interface resetPayload {
    key: string;
    login: string;
    new_password: string;
  }
  const fetchToken = async (data: ResetPassword) => {
    try {
      const response = await apiClient.post<resetPayload, string>(
        API_ENDPOINT.POST.setNewPassword,
        {
          key: key,
          login: loginKey,
          new_password: data.password,
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
      toast.success("Password reset successfully!", {
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
      router.push("/login");
    },
    onError: (error) => {
      document.body.classList.remove("loading");
      //console.log(error);
      setError("Invalid Credentials");
    },
  });

  const onSubmit: SubmitHandler<ResetPassword> = (data) => {
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
              }}
            >
              Reset Password
            </Typography>
            <Typography
              style={{
                fontFamily: "Uniform Medium !important",
                fontSize: "16px !important",
                color: customColors.greyEbco,
                margin: "1rem 0 !important",
              }}
            >
              Your new password must be different from previously used passwords
            </Typography>

            {error && (
              <p
                role="alert"
                style={{ ...inputError, font: "16px !important" }}
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
                  New Password
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
                {errors.password?.message && (
                  <Typography className="error-message">
                    {errors.password?.message}
                  </Typography>
                )}
                {errors.password?.type === "required" && (
                  <Typography className="error-message">
                    Enter new password
                  </Typography>
                )}
                {/* {errors.password?.message && (
                  <p role="alert" style={inputError}>
                    {errors.password.message}
                  </p>
                )} */}
              </Box>
              <Box sx={{ margin: "1rem 0" }}>
                <Typography variant="h6" sx={useInputLabelStyle}>
                  Confirm Password
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
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Password"
                    style={commonInputStyle}
                    {...register("confirmPassword", {
                      required: true,
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                  />
                  {!showConfirmPassword ? (
                    <Visibility
                      className="passwordIcon"
                      onClick={() => setShowConfirmPassword(true)}
                    />
                  ) : (
                    <VisibilityOff
                      className="passwordIcon"
                      onClick={() => setShowConfirmPassword(false)}
                    />
                  )}
                </Box>
                {errors.confirmPassword?.message && (
                  <Typography className="error-message">
                    {errors.confirmPassword?.message}
                  </Typography>
                )}
                {errors.confirmPassword?.type === "required" && (
                  <Typography className="error-message">
                    Enter confirm password
                  </Typography>
                )}
                {/* {errors.password?.message && (
                  <p role="alert" style={inputError}>
                    {errors.password.message}
                  </p>
                )} */}
              </Box>

              <button
                type="submit"
                style={{ ...ebcoDarkButton, marginTop: "1rem" }}
              >
                Reset Password
              </button>
            </form>
          </Box>
        </BoxShadowWrapper>
      </Box>
      <ToastContainer />
    </>
  );
};

export default ResetPassword;
