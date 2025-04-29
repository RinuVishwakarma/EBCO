"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import "./CareerDetails.css";
import Image from "next/image";
import PhoneInputWithCountrySelect, {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
// import CustomPhoneInput from '@/components/utils-components/CustomPhoneInput'
import "react-phone-number-input/style.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { CareerDetailsForm, ContactUsType } from "@/interface/ContactUs";
import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

import { customColors } from "@/styles/MuiThemeRegistry/theme";
import {
  inputError,
  useCommonInputStyle,
  useEbcoDarkBlueButtonStyle,
  useEbcoOrangeButtonStyle,
} from "@/utils/CommonStyling";
import { FileWithPath, useDropzone } from "react-dropzone";
import { E164Number } from "libphonenumber-js";
import { CareerPost } from "@/interface/Careers";
import { API_ENDPOINT } from "@/apiClient/apiEndpoint";
import { apiClient } from "@/apiClient/apiService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convertHtmltoArray, decodeHtml } from "@/utils/convertHtmltoArray";
import { toast, ToastContainer } from "react-toastify";
const fetchCareersDataApi = async (id: number): Promise<CareerPost | null> => {
  //console.log("careersData called", id);
  if (id === undefined) return null;
  try {
    const response = await apiClient.get<CareerPost | null>(
      `${API_ENDPOINT.GET.getCareers}/${id}`
    );

    if (!response || !response.data) {
      throw new Error("No data found");
    }

    //console.log(response.data, "-=-=-=-=-=-=");

    return response.data;
  } catch (error) {
    console.error("Failed to fetch new arrival data:", error);
    return null;
  }
};
const CareerDetails = () => {
  const [careerDetails, setCareerDetails] = useState<CareerPost | null>();
  const [number, setNumber] = useState<E164Number | undefined>();
  const [contact, setContact] = useState<E164Number | undefined>(undefined);
  const [fileError, setFileError] = useState<string>("");
  const params = useParams();
  const orangeEbcoButton = useEbcoOrangeButtonStyle();
  const [selectedFile, setSelectedFile] = useState<FileWithPath[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contactError, setContactError] = useState<boolean>(false);
  const { acceptedFiles, getRootProps, getInputProps, fileRejections } =
    useDropzone({
      maxFiles: 1,
      accept: {
        "application/pdf": [],
      },
      onDrop: (acceptedFiles: FileWithPath[]) => {
        ////console.log(acceptedFiles, "filess");
        setSelectedFile(acceptedFiles);
      },
    });

  const files = acceptedFiles.map((file: FileWithPath, index: number) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactUsType>();
  const fetchCareersData = useQuery({
    queryKey: ["careerDataQuery"],
    queryFn: () => fetchCareersDataApi(Number(params?.id!)),
  });
  useEffect(() => {
    const fetchData = async () => {
      //console.log("==-=-=-=-=-fetching");
      const data = await fetchCareersData.refetch();
      setCareerDetails(data.data);
      //console.log(data.data, "data");
    };
    fetchData();
  }, []);
  const handleChangeContact = (value: any) => {
    setContact(value);
  };

  useEffect(() => {
    //console.log(acceptedFiles);
    if (acceptedFiles[0]) setFileError("");
  }, [acceptedFiles]);

  const sendQuery = async (data: ContactUsType) => {
    setIsLoading(true);
    //console.log(data, selectedFile[0], contact, typeof Number(contact));
    // return;
    try {
      const response = await apiClient.post<CareerDetailsForm, any>(
        `${API_ENDPOINT.POST.sendQuery}/22216/feedback`,
        {
          _wpcf7_unit_tag: "Careers form",
          email: data.email!,
          address: data.address!,
          fullname: data.fullname!,
          mobile: contact!,
          reason: data.message!,
          resume: selectedFile[0] ? selectedFile[0] : "",
        },
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
  const mutation = useMutation({
    mutationFn: sendQuery,
    onSuccess: (data) => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      // return;
      reset();
      acceptedFiles.length = 0;
      setSelectedFile([]);
      setContact(undefined);
      setIsLoading(false);
      toast.success("Resume submited successfully!", {
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
      //console.log(data, register, "data");
    },
    onError: (error) => {
      // Handle error, e.g., show an error message to the user
      console.error("Error fetching token:", error);
    },
  });
  const onSubmit: SubmitHandler<ContactUsType> = (data) => {
    if (!contact) {
      setContactError(true)
      return
    }
    //console.log(data, "data", acceptedFiles[0]);
    if (!acceptedFiles[0]) {
      setFileError("Please upload resume");
      return;
    }
    if (acceptedFiles[0].size > 5 * 1024 * 1024) {
      setFileError("upload resume less than 5 mb");
      return;
    }

    mutation.mutate(data);
  };
  return (
    <>
      {isLoading && (
        <Box className="loader-container">
          <Box className="loader"></Box>
        </Box>
      )}
      <Box className="career-details-container">
        <Typography className="job-opening-header blue-text">
          JOB OPENING
        </Typography>
        <Box className="career-list">
          <Typography className="career-list-title">
            {decodeHtml(careerDetails?.title.rendered!)}
          </Typography>
          <span className="row-space-between career-list-place-container">
            <Image
              src={"/images/careers/place.svg"}
              alt="place"
              width={20}
              height={20}
            />
            <span className="career-list-place">
              {" "}
              {careerDetails?.acf.location}
            </span>
          </span>
          <Box className="career-experience-degree-container row-space-between">
            <Box className="row-space-between career-experience-container">
              <Image
                src={"/images/careers/user.svg"}
                alt="place"
                width={20}
                height={20}
              />
              <Typography className="career-experience">
                {" "}
                {careerDetails?.acf.required_experience}
              </Typography>
            </Box>
            <Box className="row-space-between career-degree-container">
              <Image
                src={"/images/careers/degree.svg"}
                alt="place"
                width={20}
                height={20}
              />
              <Typography className="career-degree">
                {" "}
                {careerDetails?.acf.required_education}
              </Typography>
            </Box>
          </Box>
          <Typography className="career-description">
            {convertHtmltoArray(careerDetails?.content.rendered!)}
          </Typography>
          {/* check isValidPhoneNumber method to check if number is valid */}
        </Box>
        <Box className="career-apply-container">
          <Box className="career-apply-form-container">
            <Box
              className="contact_us_body w-100"
              sx={{
                alignItems: "flex-start",
              }}
            >
              <Box className="contact_us_form">
                <form
                  className="career-form"
                  onSubmit={handleSubmit(onSubmit)}
                  style={{}}
                >
                  <Typography className="career-apply-form-header blue-text">
                    FILL OUT YOUR DETAILS
                  </Typography>
                  <Box className="career-form-container column-center">
                    <Box className="career-forms-input">
                      <Box
                        className="row-space-between"
                        sx={{
                          alignItems: "flex-start",
                        }}
                      >
                        <Box className="row-space-between input-row">
                          <Box
                            className="input-section column-space-between"
                            sx={{
                              alignItems: "flex-start",
                            }}
                          >
                            {/* <label
                        htmlFor="name"
                        className="input-label"
                        style={{
                          color: customColors.inputLabel,
                        }}
                      >
                        Full Name*
                      </label> */}
                            <input
                              id="name"
                              type="text"
                              className="contact-us-input"
                              placeholder="Full Name*"
                              style={{
                                color: customColors.lightGreyEbco,
                                border: `1px solid ${customColors.selectBox}`,
                              }}
                              {...register("fullname", {
                                required: true,
                                validate: (value) =>
                                  (value && value.trim().length > 0) ||
                                  "Enter full name",
                              })}
                            />

                            {errors.fullname?.type === "required" && (
                              <p role="alert" style={inputError}>
                                Full name is required
                              </p>
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Box
                        className="row-space-between address-phone-container"
                        sx={{
                          alignItems: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <Box className="row-space-between address-container input-row">
                          <Box
                            className="input-section-single column-space-between"
                            sx={{
                              alignItems: "flex-start",
                            }}
                          >
                            {/* <label
                        htmlFor="address"
                        className="input-label"
                        style={{
                          color: customColors.inputLabel,
                        }}
                      >
                        Address
                      </label> */}
                            <input
                              id="email"
                              type="email"
                              className="contact-us-input"
                              placeholder="Enter Email*"
                              style={{
                                color: customColors.lightGreyEbco,
                                border: `1px solid ${customColors.selectBox}`,
                              }}
                              {...register("email", {
                                required: true, // This message will be shown if the field is empty
                                pattern: {
                                  value:
                                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                  message: "Enter a valid email address", // This message will be shown if the email format is incorrect
                                },
                              })}
                            />
                            {errors.email?.type === "required" && (
                              <p role="alert" style={inputError}>
                                Email is required
                              </p>
                            )}
                          </Box>
                        </Box>
                        <Box className="row-space-between input-row">
                          <Box
                            className="input-section column-space-between"
                            sx={{
                              alignItems: "flex-start",
                            }}
                          >
                            {/* <label
                        htmlFor="number"
                        className="input-label"
                        style={{
                          color: customColors.inputLabel,
                        }}
                      >
                        Contact Number*
                      </label> */}
                            <PhoneInputWithCountrySelect
                              international
                              countryCallingCodeEditable={false}
                              defaultCountry="IN"
                              value={contact}
                              {...(register("mobile"),
                              {
                                required: true,
                              })}
                              onChange={handleChangeContact}
                              className="phone-input-custom-form"
                            />

                            {contactError && (
                              <p role="alert" style={inputError}>
                                Enter Valid Contact Number
                              </p>
                            )}

                            {/* Display error if the query is not selected */}
                            {/* {errors.query && (
                                            <span style={{ color: 'red' }}>{errors.query.message}</span>
                                        )} */}
                          </Box>
                        </Box>
                      </Box>
                      <Box className="row-space-between input-row">
                        <Box
                          className="input-section-single column-space-between"
                          sx={{
                            alignItems: "flex-start",
                          }}
                        >
                          <input
                            id="address"
                            type="text"
                            className="contact-us-input"
                            placeholder="Enter Address*"
                            style={{
                              color: customColors.lightGreyEbco,
                              border: `1px solid ${customColors.selectBox}`,
                            }}
                            {...register("address", {
                              required: true,
                              validate: (value) =>
                                (value && value.toString().trim().length > 0) ||
                                "Enter Address",
                            })}
                          />
                          {errors.address?.type === "required" && (
                            <p role="alert" style={inputError}>
                              Email is required
                            </p>
                          )}
                        </Box>
                      </Box>
                      <Box className="row-space-between input-row">
                        <Box
                          className="input-section-single column-space-between"
                          sx={{
                            alignItems: "flex-start",
                            margin: '1rem 0 !important'
                          }}
                        >
                          {/* <label
                      htmlFor="Message"
                      className="input-label"
                      style={{
                        color: customColors.inputLabel,
                      }}
                    >
                      Message
                    </label> */}
                          <textarea
                            id="message"
                            className="contact-us-input"
                            placeholder="Reason why you’re interested in joining EBCO*"
                            style={{
                              color: customColors.lightGreyEbco,
                              border: `1px solid ${customColors.selectBox}`,
                              resize: "none", // Disable resizing
                              padding: "8px", // Optional: Add padding for aesthetics
                            }}
                            rows={8} // Optional: Define the number of rows (height) for the textarea
                            {...register("message", {
                              validate: (value) =>
                                (value && value.toString().trim().length > 0) ||
                                "Enter Message",
                            })}
                          />

                          {/* Display error if the query is not selected */}
                          {errors.message && (
                            <span style={{ color: "red" }}>
                              {errors.message.message}
                            </span>
                          )}
                        </Box>
                      </Box>
                      <div {...getRootProps({ className: "dropzone" })}>
                        <Box className="column-center w-100 h-100">
                          <input {...getInputProps()} />
                          <Image
                            src={"/images/careers/backup.svg"}
                            alt="upload files"
                            width={24}
                            height={18}
                          />
                          <span className="drop-text">
                            {selectedFile.length > 0
                              ? selectedFile[0].name
                              : "Click here to attach your resume (Max 5 MB)"}
                          </span>
                        </Box>
                      </div>
                      <p
                        style={{
                          color: "red",
                          fontSize: "12px",
                          fontFamily: "Uniform Bold ",
                          textAlign: "center",
                          display: fileRejections.length > 0 ? "block" : "none",
                          margin: "0",
                        }}
                      >
                        {"Select only 1 file"}
                      </p>
                      {fileError && (
                        <p
                          role="alert"
                          style={{ ...inputError, textAlign: "center" }}
                        >
                          {fileError}
                        </p>
                      )}
                      <Box className="row-center w-100">
                        <button
                          className="submit-btn career-submit-btn"
                          type="submit"
                          style={{
                            ...orangeEbcoButton,
                          }}
                        >
                          Submit
                        </button>
                      </Box>
                    </Box>
                  </Box>
                </form>
              </Box>
              {/* <Box className="contact_us_address">
              <Box
                className="contact_us_adress_section column-space-between"
                sx={{
                  padding: "2rem",
                  backgroundColor: customColors.darkBlueEbco,
                  alignItems: "flex-start",
                }}
              >
                <Box className="office-title">
                  <Typography
                    sx={{
                      color: customColors.darkBlueEbco,
                      marginBottom: "1rem",
                    }}
                  >
                    Corporate Office Contact
                  </Typography>
                </Box>
                <Box className="office-details column-space-between">
                  <Box className="office-contact">
                    <CallIcon
                      sx={{
                        color: customColors.lightGreyEbco,
                        width: "20px",
                      }}
                    />
                    <Typography
                      sx={{
                        color: customColors.lightGreyEbco,
                        marginLeft: "1rem",
                      }}
                    >
                      +91-22-6783 7777
                    </Typography>
                  </Box>
                  <Box className="office-contact">
                    <MailIcon
                      sx={{
                        color: customColors.lightGreyEbco,
                        width: "20px",
                      }}
                    />
                    <Typography
                      sx={{
                        color: customColors.lightGreyEbco,
                        marginLeft: "1rem",
                      }}
                    >
                      info@ebco.in 
                    </Typography>
                  </Box>
                  <Box className="office-contact">
                    <LocationOnRoundedIcon
                      sx={{
                        color: customColors.lightGreyEbco,
                        width: "20px",
                      }}
                    />
                    <Typography
                      sx={{
                        color: customColors.lightGreyEbco,
                        marginLeft: "1rem",
                      }}
                    >
                      Ebco Private Limited <br /> 402-3, Hyde Park, Saki Vihar
                      Road, <br />
                      Opposite Ansa Industrial Estate, Chandivali, <br />
                      Andheri (East), Mumbai - 400 072 <br />
                      CIN NO: U29299MH1973PTC016890
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.920983755593!2d72.88519667472148!3d19.111122050869938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c80dc38c33c1%3A0x92eda05cf4a081ab!2sEbco%20Private%20Limited%20(Head%20Office)!5e0!3m2!1sen!2sin!4v1713942435236!5m2!1sen!2sin"
                  className="address-map"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
            </Box> */}
            </Box>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </>
  );
};

export default CareerDetails;
