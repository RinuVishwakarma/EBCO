import { Box, TextField, Typography } from "@mui/material";
import "./Profile.css";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProfileType } from "@/interface/ContactUs";
import { apiClient } from "@/apiClient/apiService";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserInfo } from "@/interface/UserInfo";
import { useAppSelector } from "@/store/reduxHooks";
import { toast, ToastContainer } from "react-toastify";

// src/interface/UserInfo.ts
export interface UserInfoPayload {
  first_name: string;
  email: string;
  meta: Meta;
  acf?: Acf;
  profile_picture?: File;
}

interface Meta {
  billing_address_1: string;
  billing_phone: string;
}

interface Acf {
  profile_picture: number;
}

// src/interface/UserInfo.ts
export interface UserInfoResponse {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  billing_address_1: string;
  billing_address_2: string;
  gst_in: string;
  billing_phone: string;
  profile_picture: string;
}

const Profile = () => {
  const [profileImg, setProfileImg] = useState<string>("");

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useAppSelector((state) => state.auth).token;
  const [profileImgError, setProfileImgError] = useState<string>("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileType>();

  const updateInfo = async (data: ProfileType) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("first_name", data.firstName);
    formData.append("meta[billing_address_1]", data.address);
    formData.append("meta[billing_address_2]", data.address2!);
    formData.append("meta[gst_in]", data.gstIn)

    formData.append("meta[billing_phone]", data.contactNumber.toString());

    //console.log(profileImage, "profileImg");
    if (profileImage) {
      //console.log("profileImg", profileImage);
      formData.append("profile_picture", profileImage);
    } else {
      //console.log("profileImg ====", profileImage);

      formData.append("acf[profile_picture]", "");
    }
    try {
      const response = await apiClient.post<any, UserInfoResponse>(
        `${API_ENDPOINT.POST.updateUserInfo}`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      setIsLoading(false);
      // //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response;
    } catch { }
  };
  const mutationInfo = useMutation({
    mutationFn: updateInfo,
    onSuccess: async (data) => {
      //console.log(data, "--=-=-=-=---=-=-=-=-=-========");
      if (data) {
        setValue("address", data.billing_address_1);
        setValue("contactNumber", Number(data.billing_phone));
        setValue("firstName", data.first_name);
        setValue("email", data.email);
        setValue("address2", data.billing_address_2)
        setValue("gstIn", data.gst_in)
      }

      toast.success("Profile updated successfully", {
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
      // Handle success, e.g., store the token, navigate to another page, etc.
    },
    onError: (error) => {
      // Handle error, e.g., show an error message to the user
      //console.error("Error fetching token:", error);
    },
  });

  const fetchUserInfo = async (): Promise<UserInfo | null> => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<UserInfo>(
        `${API_ENDPOINT.GET.getUserInfo}?acf_format=standard`
      );
      if (!response) {
        throw new Error("No data found");
      }
      setIsLoading(false);
      //console.log(response.data, "User info")
      return response.data;
    } catch (error) {
      //console.error("Failed to fetch new arrival data", error);
      return null;
    }
  };

  const infoQuery = useQuery({
    queryKey: ["user-info"],
    queryFn: fetchUserInfo,

  });

  useEffect(() => {
    let getUserInfo = async () => {
      let data = await infoQuery.refetch();
      //console.log("USER INFO RUNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN", data, infoQuery.status)
    }
    getUserInfo()
  }, []);

  useEffect(() => {
    if (infoQuery.data) {
      const userInfo = infoQuery.data;
      setValue("firstName", `${userInfo.first_name} `);
      setValue("email", userInfo.email || '');
      setValue("contactNumber", Number(userInfo.billing_phone));
      setValue("address", userInfo.billing_address_1 || '');
      setValue("address2", userInfo.billing_address_2 || '');
      setValue("gstIn", userInfo.gst_in.toString())


      setProfileImg(userInfo.acf.profile_picture!);
    }
  }, [infoQuery.data, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 800 * 1024; // 800kB in bytes

      if (allowedTypes.includes(file.type)) {
        if (file.size <= maxSize) {
          setProfileImage(file);
          setProfileImg(URL.createObjectURL(file));
          setValue("profileImg", URL.createObjectURL(file));
        } else {
          setProfileImgError("File size exceeds the limit (800kB).");
        }
      } else {
        setProfileImgError("Only JPG, GIF, and PNG files are allowed.");
      }
    }
  };

  useEffect(() => {
    if (profileImgError) {
      const timeout = setTimeout(() => {
        setProfileImgError("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [profileImgError]);

  const onSubmit: SubmitHandler<ProfileType> = (data) => {
    mutationInfo.mutate(data);
    //console.log(data);
  };

  return (
    <>
      {isLoading && (
        <Box className="loader-container">
          <Box className="loader"></Box>
        </Box>
      )}
      <Box className="profile-container">
        <Box className="profile-image-container">
          <Box
            className="profile-image"
            sx={{
              backgroundImage: profileImg
                ? `url(${profileImg})`
                : "linear-gradient(135deg, #092853 0%, #092853 100%)",
            }}
          >
            {!profileImg && (
              <Typography className="profile-image-text">JP</Typography>
            )}
          </Box>
          <Box className="profile-upload-container">
            <label htmlFor="profile-file-picker" className="custom-file-input">
              Upload Image
            </label>
            <input
              type="file"
              name="file"
              id="profile-file-picker"
              className="profile-file-picker"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Typography className="profile-upload-error">
              {profileImgError}
            </Typography>
            <Typography className="profile-upload-text">
              Allowed JPG, GIF or PNG. Max size of 800kB
            </Typography>
          </Box>
        </Box>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="profile-form-container"
        >
          <Box className="profile-input-container">
            <TextField
              label="Full Name*"
              color="info"
              defaultValue=""
              InputProps={{ inputProps: { min: 0 } }}
              InputLabelProps={{ shrink: true }}
              {...register("firstName", {
                required: true,
                validate: (value) =>
                  (value && value.trim().length > 0) || "Enter full name",
              })}
              sx={{
                "& .MuiInputLabel-root": { color: "grey !important" },
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: "grey !important" },
                },
              }}
            />
            {errors.firstName?.type === "required" && (
              <Typography className="error-message">Enter full name</Typography>
            )}
          </Box>
          <Box className="profile-input-container">
            <TextField
              label="Email*"
              type="email"
              color="info"
              defaultValue=""
              InputProps={{ inputProps: { min: 0 } }}
              InputLabelProps={{ shrink: true }}
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              sx={{
                "& .MuiInputLabel-root": { color: "grey !important" },
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: "grey !important" },
                },
              }}
            />
            {errors.email?.type === "required" && (
              <Typography className="error-message">Enter email</Typography>
            )}
            {errors.email?.message && (
              <Typography className="error-message">
                Enter a valid email
              </Typography>
            )}
          </Box>
          <Box className="profile-input-container">
            <TextField
              label="Address line 1*"
              color="info"
              defaultValue=""
              InputProps={{ inputProps: { min: 0 } }}
              InputLabelProps={{ shrink: true }}
              {...register("address", {
                required: true,
                validate: (value) =>
                  (value && value.trim().length > 0) || "Enter address",
              })}
              sx={{
                "& .MuiInputLabel-root": { color: "grey !important" },
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: "grey !important" },
                },
              }}
            />
            {errors.address?.type === "required" && (
              <Typography className="error-message">Enter address</Typography>
            )}
          </Box>
          <Box className="profile-input-container">
            <TextField
              label="Address line 2"
              color="info"
              defaultValue=""
              InputProps={{ inputProps: { min: 0 } }}
              InputLabelProps={{ shrink: true }}
              {...register("address2")}
              sx={{
                "& .MuiInputLabel-root": { color: "grey !important" },
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: "grey !important" },
                },
              }}
            />

          </Box>
          <Box className="profile-input-container">
            <TextField
              label="Contact Number*"
              type="number"
              color="info"
              defaultValue=""
              InputProps={{ inputProps: { min: 0 } }}
              InputLabelProps={{ shrink: true }}
              {...register("contactNumber", {
                required: true,
                validate: (value) =>
                  (value && value.toString().trim().length > 0) ||
                  "Enter contact number",
              })}
              sx={{
                "& .MuiInputLabel-root": { color: "grey !important" },
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: "grey !important" },
                },
              }}
            />
            {errors.contactNumber?.type === "required" && (
              <Typography className="error-message">
                Enter contact number
              </Typography>
            )}
          </Box>
          <Box className="profile-input-container">
            <TextField
              label="GST IN"
              type="text"
              color="info"
              defaultValue=""
              InputProps={{ inputProps: { min: 0 } }}
              InputLabelProps={{ shrink: true }}
              {...register("gstIn")}
              sx={{
                "& .MuiInputLabel-root": { color: "grey !important" },
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { borderColor: "grey !important" },
                },
              }}
            />

          </Box>
          <button type="submit" className="profile-save-btn">
            SAVE CHANGES
          </button>
        </form>
      </Box>
      <ToastContainer />
    </>
  );
};

export default Profile;
