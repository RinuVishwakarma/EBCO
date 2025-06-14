import {
  Box,
  Modal,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { Address } from "@/interface/Address";
import React, { useEffect } from "react";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
// import "@/app/(unprotected-route)/checkout/Checkout.css";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Image from "next/image";
import { inputError, useEbcoOrangeButtonStyle } from "@/utils/CommonStyling";
import { useAppSelector } from "@/store/reduxHooks";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { apiClient } from "@/apiClient/apiService";
import { PostalCodeResponse } from "@/interface/PostalCode";


interface BillingAddressFormProps {
  open: boolean;
  handleClose: () => void;
  setAddressData: React.Dispatch<React.SetStateAction<Address | null>>;
  initialValues: Address | null; // Add initialValues prop
  shippingAddress: Address | null;
}

const BillingAddressForm: React.FC<BillingAddressFormProps> = ({
  open,
  handleClose,
  setAddressData,
  initialValues,
  shippingAddress,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<Address>();
  const orangeEbcoButton = useEbcoOrangeButtonStyle();
  const personalInfo = useAppSelector((state) => state.auth)
  const watchedPincode = watch("pincode");
  const pincodeRedux = useAppSelector((state) => state.pincode).pincode

  useEffect(() => {
    if (initialValues) {
      for (const key in initialValues) {
        setValue(key as keyof Address, initialValues[key as keyof Address]);
      }
    }
  }, [initialValues, setValue]);
  useEffect(() => {
    //console.log(watchedPincode);
    if (watchedPincode?.toString().length === 6) {
      mutationPostal.mutate(watchedPincode);
    }
  }, [watchedPincode]);
  const checkPostal = async (data: number) => {
    try {
      const response = await apiClient.get<PostalCodeResponse>(
        `${API_ENDPOINT.GET.sendPostalCode}/${data}`,
        {
          postalCode: data,
        }
      );
      // //console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      return response;
    } catch { }
  };
  const mutationPostal = useMutation({
    mutationFn: checkPostal,
    onSuccess: async (data) => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      document.body.classList.remove("loading");
      //console.log(data?.data, "-=-=-=-=-=POSTAL");
      if (data?.data) {
        //console.log(data.data, "Pincode details")
        setValue("city", data.data.city_name)
        setValue("state", data.data.state_name)
        setValue("country", data.data.country_name)
      }


    },
    onError: (error) => {
      // Handle error, e.g., show an error message to the user
      console.error("Error fetching token:", error);
    },
  });
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    //console.log(event.target.checked, "--=====");
    if (event.target.checked) {
      setAddressData(shippingAddress);
    }
  };

  useEffect(() => {
    // Replace this with your actual data fetching
    const fetchData = async () => {
      // localStorage.getItem("addressData");
      let address = {
        fullName: personalInfo?.first_name! + personalInfo.last_name || '',
        email: personalInfo?.email || "",
        mobile: Number(personalInfo?.billing_phone) || null,
        flatNumber: personalInfo?.billing_address_1 || "",
        addressLine2: personalInfo?.billing_address_2 || "",
        gst_in: personalInfo?.gst_in || ''
      }
      setValue("fullName", personalInfo?.first_name + " " + personalInfo?.last_name)
      setValue("email", personalInfo?.email!)
      setValue("mobile", Number(personalInfo?.billing_phone) || null)
      setValue("flatNumber", personalInfo?.billing_address_1 || "")
      setValue("address2", personalInfo?.billing_address_2 || "")
      setValue("GSTIN", personalInfo?.gst_in)
      setValue("pincode", Number(pincodeRedux))
      setAddressData(address)
    };

    fetchData();
  }, []);
  useEffect(() => {
    //console.log("errors", errors);
  }, [errors]);

  const onSubmit: SubmitHandler<Address> = (data) => {
    //console.log(data);
    if (data) {
      setAddressData(data);
    }
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="modal-billing row-center"
    >
      <Box
        sx={{
          width: "50vw",
          height: "75vh",
          background: customColors.whiteEbco,
          outline: "none",
          position: "relative",
          borderRadius: "8px",
          justifyContent: "flex-start",
        }}
        className="column-center shipping-modal-container"
      >
        <CancelOutlinedIcon
          sx={{
            color: customColors.darkBlueEbco,
            position: "absolute",
            top: "2rem",
            right: "2rem",
            width: "24px",
            height: "24px",
            cursor: "pointer",
          }}
          className="visit-center-close"
          onClick={handleClose}
        />
        <Image
          src={"/images/darkLogoEbco.png"}
          alt="Ebco Logo"
          width={100}
          height={70}
        />
        <Typography
          sx={{
            color: customColors.darkBlueEbco,
            fontFamily: "Uniform Bold",
          }}
          className="visit-center-title"
        >
          Enter Billing Address
        </Typography>
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={handleChange} />}
          label="Same as shipping address"
          className="shipping-address-label"
          sx={{
            color: customColors.darkBlueEbco,
          }}
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" w-100 checkout-address"
          style={{}}
        >
          <Box className="row-space-between input-row checkout-input w-50">
            <Box
              className="input-section column-space-between w-100"
              sx={{
                alignItems: "flex-start",
              }}
            >
              <TextField
                label="Full Name *"
                id="name"
                type="text"
                defaultValue=""
                InputProps={{ inputProps: { min: 0 } }}
                InputLabelProps={{ shrink: true }}
                className="contact-us-input no-padding"
                placeholder="Full Name *"
                style={{
                  color: customColors.lightGreyEbco,
                  border: `1px solid ${customColors.selectBox}`,
                  padding: '0 !important'
                }}
                {...register("fullName", {
                  required: true,
                  validate: (value) =>
                    (value && value.trim().length > 0) || "Enter full name",
                })}
              />

              {errors.fullName?.type === "required" && (
                <p role="alert" style={inputError}>
                  Full name is required
                </p>
              )}
            </Box>
          </Box>
          <Box className="row-space-between input-row checkout-input w-50">
            <Box
              className="input-section column-space-between"
              sx={{
                alignItems: "flex-start",
                flex: "1",
              }}
            >
              <TextField
                label="Mobile Number *"
                id="number"
                type="number"
                className="contact-us-input no-padding"
                defaultValue=""
                InputProps={{ inputProps: { min: 0 } }}
                InputLabelProps={{ shrink: true }}
                placeholder="Enter Mobile *"
                style={{
                  color: customColors.lightGreyEbco,
                  border: `1px solid ${customColors.selectBox}`,
                  padding: '0 !important'
                }}
                {...register("mobile", {
                  required: true,
                  validate: (value) =>
                    (value && value.toString().trim().length > 0) ||
                    "Enter Mobile Number",
                })}
              />

              {errors.mobile?.type === "required" && (
                <p role="alert" style={inputError}>
                  Mobile Number is required
                </p>
              )}
            </Box>
          </Box>
          <Box className="row-space-between input-row checkout-input w-50">
            <Box
              className="input-section column-space-between"
              sx={{
                alignItems: "flex-start",
                flex: "1",
              }}
            >
              <TextField
                label="Email *"
                id="email"
                type="email"
                className="contact-us-input no-padding"
                defaultValue=""
                InputProps={{ inputProps: { min: 0 } }}
                InputLabelProps={{ shrink: true }}
                placeholder="Enter Email Address *"
                style={{
                  color: customColors.lightGreyEbco,
                  border: `1px solid ${customColors.selectBox}`,
                  padding: '0 !important'
                }}
                {...register("email", {
                  required: true,
                  validate: (value) =>
                    (value && value.toString().trim().length > 0) ||
                    "Enter Email address",
                })}
              />

              {errors.email?.type === "required" && (
                <p role="alert" style={inputError}>
                  Email is required
                </p>
              )}
            </Box>
          </Box>
          <Box className="row-space-between input-row checkout-input w-50">
            <Box
              className="input-section column-space-between"
              sx={{
                alignItems: "flex-start",
                flex: "1",
              }}
            >
              <TextField
                label="Address Line 1 *"
                id="text"
                type="text"
                defaultValue=""
                InputProps={{ inputProps: { min: 0 } }}
                InputLabelProps={{ shrink: true }}
                className="contact-us-input no-padding"
                placeholder="Enter Address Line 1 *"
                style={{
                  color: customColors.lightGreyEbco,
                  border: `1px solid ${customColors.selectBox}`,
                  padding: '0 !important'
                }}
                {...register("flatNumber", {
                  required: true,
                  validate: (value) =>
                    (value && value.toString().trim().length > 0) ||
                    "Enter flat number and building name",
                })}
              />

              {errors.flatNumber?.type === "required" && (
                <p role="alert" style={inputError}>
                  Flat No. or Building name is required
                </p>
              )}
            </Box>
          </Box>
          <Box className="row-space-between input-row checkout-input w-50">
            <Box
              className="input-section column-space-between"
              sx={{
                alignItems: "flex-start",
                flex: "1",
              }}
            >
              <TextField
                label="Address Line 2"
                id="street"
                type="text"
                className="contact-us-input no-padding"
                defaultValue=""
                InputProps={{ inputProps: { min: 0 } }}
                InputLabelProps={{ shrink: true }}
                placeholder="Enter Address Line 2"
                style={{
                  color: customColors.lightGreyEbco,
                  border: `1px solid ${customColors.selectBox}`,
                  padding: '0 !important'
                }}
                {...register("address2", {
                  required: false,
                })}
              />

              {errors.address2?.type === "required" && (
                <p role="alert" style={inputError}>
                  Address line 2 is required
                </p>
              )}
            </Box>
          </Box>
          <Box className="row-space-between input-row checkout-input w-50">
            <Box
              className="input-section column-space-between"
              sx={{
                alignItems: "flex-start",
                flex: "1",
              }}
            >
              <TextField
                label="Pincode *"
                id="number"
                type="number"
                className="contact-us-input no-padding"
                defaultValue=""
                InputProps={{ inputProps: { min: 0 } }}
                InputLabelProps={{ shrink: true }}
                placeholder="Enter Pincode *"
                style={{
                  color: customColors.lightGreyEbco,
                  border: `1px solid ${customColors.selectBox}`,
                  padding: '0 !important'
                }}
                {...register("pincode", {
                  required: true,
                  validate: (value) =>
                    (value && value.toString().trim().length > 0) ||
                    "Enter pincode",
                })}
              />

              {errors.pincode?.type === "required" && (
                <p role="alert" style={inputError}>
                  Pincode is required
                </p>
              )}
            </Box>
          </Box>

          <Box className="row-space-between input-row checkout-input w-50">
            <Box
              className="input-section column-space-between"
              sx={{
                alignItems: "flex-start",
                flex: "1",
              }}
            >
              <TextField
                label="City *"
                id="city"
                type="text"
                className="contact-us-input no-padding"
                placeholder="Enter City *"
                defaultValue=""
                InputProps={{ inputProps: { min: 0 } }}
                disabled

                InputLabelProps={{ shrink: true }}
                style={{
                  color: customColors.lightGreyEbco,
                  border: `1px solid ${customColors.selectBox}`,
                  padding: '0 !important'
                }}
                {...register("city", {
                  required: true,
                  validate: (value) =>
                    (value && value.toString().trim().length > 0) ||
                    "Enter city name",
                })}
              />

              {errors.city?.type === "required" && (
                <p role="alert" style={inputError}>
                  Full name is required
                </p>
              )}
            </Box>
          </Box>
          <Box className="row-space-between input-row checkout-input w-50">
            <Box
              className="input-section column-space-between"
              sx={{
                alignItems: "flex-start",
                flex: "1",
              }}
            >
              <TextField
                label="State *"
                id="state"
                type="text"
                className="contact-us-input no-padding"
                placeholder="Enter state *"
                defaultValue=""
                InputProps={{ inputProps: { min: 0 } }}
                InputLabelProps={{ shrink: true }}
                disabled

                style={{
                  color: customColors.lightGreyEbco,
                  border: `1px solid ${customColors.selectBox}`,
                  padding: '0 !important'
                }}
                {...register("state", {
                  required: true,
                  validate: (value) =>
                    (value && value.toString().trim().length > 0) ||
                    "Enter full name",
                })}
              />

              {errors.state?.type === "required" && (
                <p role="alert" style={inputError}>
                  State is required
                </p>
              )}
            </Box>
          </Box>
          <Box className="row-space-between input-row checkout-input w-50">
            <Box
              className="input-section column-space-between"
              sx={{
                alignItems: "flex-start",
                flex: "1",
              }}
            >
              <TextField
                label="Country *"
                id="country"
                type="text"
                className="contact-us-input no-padding"
                placeholder="Enter Country *"
                defaultValue=""
                InputProps={{ inputProps: { min: 0 } }}
                InputLabelProps={{ shrink: true }}
                disabled

                style={{
                  color: customColors.lightGreyEbco,
                  border: `1px solid ${customColors.selectBox}`,
                  padding: '0 !important'
                }}
                {...register("country", {
                  required: true,
                  validate: (value) =>
                    (value && value.toString().trim().length > 0) ||
                    "Enter Countrye",
                })}
              />

              {errors.country?.type === "required" && (
                <p role="alert" style={inputError}>
                  Country is required
                </p>
              )}
            </Box>
          </Box>
          <Box className="row-space-between input-row checkout-input w-50">
            <Box
              className="input-section column-space-between"
              sx={{
                alignItems: "flex-start",
                flex: "1",
              }}
            >
              <TextField
                label="GST IN"
                id="gst"
                type="text"
                className="contact-us-input no-padding"
                placeholder="Enter GSTIN "
                style={{
                  color: customColors.lightGreyEbco,
                  border: `1px solid ${customColors.selectBox}`,
                  padding: '0 !important'
                }}
                {...register("GSTIN", {
                  required: false,
                })}
              />
            </Box>
          </Box>

          <button
            className="submit-btn"
            type="submit"
            style={{ ...orangeEbcoButton, marginTop: "2rem" }}
          >
            SAVE AND PROCEED
          </button>
        </form>
      </Box>
    </Modal>
  );
};

export default BillingAddressForm;
