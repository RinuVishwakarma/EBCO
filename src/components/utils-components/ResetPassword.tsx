import {
  Box,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import "./ResetPassword.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProfileType, ResetPasswordProp } from "@/interface/ContactUs";
import { useEffect, useState } from "react";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/apiClient/apiService";
import { toast, ToastContainer } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordProp>();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const newPassword = watch("newpassword", "");

  interface UserInfoPayload {
    current_password: string;
    new_password: string;
  }

  interface UserInfoResponse {
    message: string;
    status: number;
  }

  const updateInfo = async (data: ResetPasswordProp) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<UserInfoPayload, UserInfoResponse>(
        `${API_ENDPOINT.POST.changePassword}`,
        {
          current_password: data.currentpassword,
          new_password: data.newpassword,
        }
      );
      setIsLoading(false);
      //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response;
    } catch {}
  };

  const mutationInfo = useMutation({
    mutationFn: updateInfo,
    onSuccess: async (data) => {
      //console.log("-=-=-=-");
      toast.success("Password changed successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      reset();
    },
    onError: (error) => {
      console.error("Error fetching token:", error);
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordProp> = (data) => {
    mutationInfo.mutate(data);
  };

  useEffect(() => {}, [errors]);

  return (
    <>
      {isLoading && (
        <Box className="loader-container">
          <Box className="loader"></Box>
        </Box>
      )}
      <Box className="reset-password-wrapper">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="profile-form-container"
        >
          <Box className="profile-input-container">
            <TextField
              label="Current Password"
              color={"info"}
              type={showCurrentPassword ? "text" : "password"}
              {...register("currentpassword", {
                required: true,
                validate: (value) =>
                  (value && value.trim().length > 0) ||
                  "Enter current password",
              })}
              sx={{
                "& .MuiInputLabel-root": { color: "grey !important" }, //styles the label
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: "grey !important" },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    sx={{ width: "5% !important" }}
                    className="input-adornment"
                    position="end"
                  >
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.currentpassword?.message && (
              <Typography className="error-message">
                {errors.currentpassword?.message}
              </Typography>
            )}
            {errors.currentpassword?.type === "required" && (
              <Typography className="error-message">
                Enter current password
              </Typography>
            )}
          </Box>
          <Box className="desktop-view"></Box>
          <Box className="profile-input-container">
            <TextField
              label="New Password"
              color={"info"}
              type={showNewPassword ? "text" : "password"}
              {...register("newpassword", {
                required: true,
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
                  message: "Password must meet the specified criteria",
                },
              })}
              sx={{
                "& .MuiInputLabel-root": { color: "grey !important" }, //styles the label
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: "grey !important" },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ width: "5% !important" }}
                    className="input-adornment"
                  >
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.newpassword?.message && (
              <Typography className="error-message">
                {errors.newpassword?.message}
              </Typography>
            )}
            {errors.newpassword?.type === "required" && (
              <Typography className="error-message">
                Enter new password
              </Typography>
            )}
          </Box>
          <Box className="profile-input-container">
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmpassword", {
                required: true,
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
                  message: "Password must meet the specified criteria",
                },
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              color={"info"}
              sx={{
                "& .MuiInputLabel-root": { color: "grey !important" }, //styles the label
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: "grey !important" },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ width: "5% !important" }}
                    className="input-adornment"
                  >
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.confirmpassword?.message && (
              <Typography className="error-message">
                {errors.confirmpassword?.message}
              </Typography>
            )}
            {errors.confirmpassword?.type === "required" && (
              <Typography className="error-message">
                Enter confirm password
              </Typography>
            )}
          </Box>
          <Box className="password-requirement-container">
            <Typography className="password-requirement-header">
              Password Requirements
            </Typography>
            <Typography className="password-requirement-description">
              Minimum 8 characters long - the more, the better
            </Typography>
            <Typography className="password-requirement-description">
              At least one lowercase character, one uppercase character{" "}
            </Typography>
            <Typography className="password-requirement-description">
              At least one number
            </Typography>
          </Box>
          <Box></Box>

          <button type="submit" className="profile-save-btn">
            SAVE CHANGES
          </button>
        </form>
      </Box>
      <ToastContainer />
    </>
  );
};

export default ResetPassword;
