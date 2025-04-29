'use client'
import { Box, Typography } from '@mui/material'
import './ContactUs.css'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import CallIcon from '@mui/icons-material/Call'
import MailIcon from '@mui/icons-material/Mail'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ContactUsType } from '@/interface/ContactUs'
import ApartmentIcon from '@mui/icons-material/Apartment'
import { useState } from 'react'
import {
  inputError,
  useCommonInputStyle,
  useEbcoDarkBlueButtonStyle,
  useEbcoOrangeButtonStyle,
} from '@/utils/CommonStyling'
import Image from 'next/image'
import Head from 'next/head'
import { useMutation } from '@tanstack/react-query'
import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { apiClient } from '@/apiClient/apiService'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const ContactUs = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactUsType>()
  const orangeEbcoButton = useEbcoOrangeButtonStyle()
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<string[]>([
    'Business Enquiry',
    'Feedback',
    'Distributorship / Dealership',
    'Technical Query',
    'Customer Support',
    'General Enquiry',
  ])
  interface contactUsApi {
    _wpcf7_unit_tag?: string
    fullname: string
    query: string
    address: string
    message: string
    mobile: string | number
    email: string
  }
  const sendQuery = async (data: contactUsApi) => {
    // return;
    setIsLoading(true)
    try {
      const response = await apiClient.post<contactUsApi, any>(
        `${API_ENDPOINT.POST.sendQuery}/23190/feedback`,
        {
          _wpcf7_unit_tag: 'contact us',
          fullname: data.fullname,
          query: data.query,
          address: data.address,
          message: data.message,
          mobile: data.mobile,
          email: data.email,
        },
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      )
      // console.log(response, "--=-=-=-=---=-=-=-=-=-========");
      setIsLoading(false)
      return response
    } catch {}
  }
  const mutation = useMutation({
    mutationFn: sendQuery,
    onSuccess: data => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      // return;
      toast.success(`Query sent successfully`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        // transition: Bounce,
      })
      reset()
      document.body.classList.remove('loading')

      // handleCloseDiscoveryCenterModal();
    },
    onError: error => {
      // Handle error, e.g., show an error message to the user
      console.error('Error fetching token:', error)
    },
  })
  const onSubmit: SubmitHandler<ContactUsType> = data => {
    if (selectedOption === 'Select a Query') {
      toast.error('Select a Query', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
      return
    }
    // console.log(data);
    mutation.mutate(data)
  }
  const [selectedOption, setSelectedOption] = useState<string>('Select a Query')
  return (
    <>
      <Head>
        <title>Contact Us</title>
      </Head>
      {isLoading && (
        <Box className='loader-container'>
          <Box className='loader'></Box>
        </Box>
      )}
      <Box className='contact_us_container column-space-between'>
        <Box className='contact_us_section w-100'>
          <Box
            className='contact_us_header w-100'
            sx={{
              marginBottom: '2rem',
            }}
          >
            <Typography
              className='contact_us_title'
              sx={{
                fontFamily: 'Uniform Bold',
                color: customColors.darkBlueEbco,
              }}
            >
              CONTACT US
            </Typography>
            <Typography
              className='contact_us_subtitle'
              sx={{
                color: customColors.lightGreyEbco,
              }}
            >
              Have any question or feedback, feel free to reach out to us. We
              are always available to help.
            </Typography>
          </Box>
          <Box
            className='contact_us_body row-space-between w-100'
            sx={{
              alignItems: 'flex-start',
            }}
          >
            <Box className='contact_us_address'>
              {/* <Box
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
                      color: customColors.whiteEbco,
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
                        color: customColors.whiteEbco,
                        width: "20px",
                      }}
                    />
                    <Typography
                      sx={{
                        color: customColors.whiteEbco,
                        marginLeft: "1rem",
                      }}
                    >
                      +91-22-6783 7777
                    </Typography>
                  </Box>
                  <Box className="office-contact">
                    <MailIcon
                      sx={{
                        color: customColors.whiteEbco,
                        width: "20px",
                      }}
                    />
                    <Typography
                      sx={{
                        color: customColors.whiteEbco,
                        marginLeft: "1rem",
                      }}
                    >
                      info@ebco.in 
                    </Typography>
                  </Box>
                  <Box className="office-contact">
                    <LocationOnRoundedIcon
                      sx={{
                        color: customColors.whiteEbco,
                        width: "20px",
                      }}
                    />
                    <Typography
                      sx={{
                        color: customColors.whiteEbco,
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
              </Box> */}
              <Box>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.920983755593!2d72.88519667472148!3d19.111122050869938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c80dc38c33c1%3A0x92eda05cf4a081ab!2sEbco%20Private%20Limited%20(Head%20Office)!5e0!3m2!1sen!2sin!4v1713942435236!5m2!1sen!2sin'
                  className='address-map'
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  style={{
                    border: '1px solid #ccc !important',
                  }}
                />
              </Box>
            </Box>
            <Box className='contact_us_form '>
              <form onSubmit={handleSubmit(onSubmit)} style={{}}>
                <Box
                  className='row-space-between input-container'
                  sx={{
                    alignItems: 'flex-start',
                  }}
                >
                  <Box className='row-space-between input-row'>
                    <Box
                      className='input-section column-space-between'
                      sx={{
                        alignItems: 'flex-start',
                      }}
                    >
                      <label
                        htmlFor='query'
                        className='input-label'
                        style={{
                          color: customColors.inputLabel,
                        }}
                      >
                        Type of query*
                      </label>
                      <select
                        id='query'
                        {...register('query', {
                          required: 'Please select a query',
                        })}
                        className='input-box'
                        value={selectedOption}
                        onChange={e => setSelectedOption(e.target.value)}
                        style={{
                          padding: '0.5rem',
                          borderColor: customColors.selectBox,
                          fontSize: '16px !important',
                          fontFamily: 'Uniform Medium',
                          color: customColors.lightGreyEbco,
                          borderRadius: '4px',
                        }}
                      >
                        {/* Placeholder option */}
                        <option value='' selected>
                          Select a Query
                        </option>

                        {/* Options */}
                        {options.map((option, index) => {
                          return (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          )
                        })}
                      </select>
                      {errors.query?.type === 'required' && (
                        <p role='alert' style={inputError}>
                          Please Select a query
                        </p>
                      )}
                      {/* Display error if the query is not selected */}
                      {/* {errors.query && (
                                        <span style={{ color: 'red' }}>{errors.query.message}</span>
                                    )} */}
                    </Box>

                    {/* <Box className="input-section column-space-between" sx={{
                                alignItems:'flex-start'
                            }}>
                                    <label htmlFor="profession" className="input-label" style={{
                                        color:customColors.inputLabel,
                                    }}>Select your profession*</label>
                                    <select
                                        id="profession"
                                        {...register('profession', { required: 'Please select a profession' })}
                                        style={{ padding: '0.5rem' , 
                                            borderColor:customColors.selectBox,
                                            fontSize:'16px !important',
                                            fontFamily:'Uniform Medium',
                                            color:customColors.lightGreyEbco,
                                            borderRadius:'4px',
                                        }}
                                    >
                                        <option value="" disabled selected>
                                            Select a profession
                                        </option>

                                    {
                                        options.map((option ,index)=>{
                                            return <option key={index} value={option}>{option}</option>
                                        })
                                    }
                                    </select>
                                    {errors.profession?.type === "required" && (
                                                <p role="alert" style={inputError}>Profession is required</p>
                                            )}
                                  
                            </Box> */}
                  </Box>
                  <Box className='row-space-between input-row'>
                    <Box
                      className='input-section column-space-between'
                      sx={{
                        alignItems: 'flex-start',
                      }}
                    >
                      <label
                        htmlFor='name'
                        className='input-label'
                        style={{
                          color: customColors.inputLabel,
                        }}
                      >
                        Full Name*
                      </label>
                      <input
                        id='name'
                        type='text'
                        className='contact-us-input'
                        placeholder=''
                        style={{
                          color: customColors.lightGreyEbco,
                          border: `1px solid ${customColors.selectBox}`,
                        }}
                        {...register('fullname', {
                          required: true,
                          validate: value =>
                            (value && value.trim().length > 0) ||
                            'Enter full name',
                        })}
                      />

                      {errors.fullname?.type === 'required' && (
                        <p role='alert' style={inputError}>
                          Full name is required
                        </p>
                      )}

                      {/* Display error if the query is not selected */}
                      {/* {errors.query && (
                                        <span style={{ color: 'red' }}>{errors.query.message}</span>
                                    )} */}
                    </Box>
                  </Box>
                </Box>
                <Box
                  className='row-space-between input-container'
                  sx={{
                    alignItems: 'flex-start',
                  }}
                >
                  <Box className='row-space-between input-row'>
                    <Box
                      className='input-section column-space-between'
                      sx={{
                        alignItems: 'flex-start',
                      }}
                    >
                      <label
                        htmlFor='number'
                        className='input-label'
                        style={{
                          color: customColors.inputLabel,
                        }}
                      >
                        Contact Number*
                      </label>
                      <input
                        id='number'
                        type='number'
                        className='contact-us-input'
                        placeholder=''
                        style={{
                          color: customColors.lightGreyEbco,
                          border: `1px solid ${customColors.selectBox}`,
                        }}
                        {...register('mobile', {
                          required: true,
                          validate: value =>
                            (value && value.toString().trim().length > 0) ||
                            'Enter Contact Number',
                        })}
                      />

                      {errors.mobile?.type === 'required' && (
                        <p role='alert' style={inputError}>
                          Contact Number is required
                        </p>
                      )}

                      {/* Display error if the query is not selected */}
                      {/* {errors.query && (
                                            <span style={{ color: 'red' }}>{errors.query.message}</span>
                                        )} */}
                    </Box>
                    {/* <Box className="input-section column-space-between" sx={{
                                    alignItems:'flex-start'
                                }}>
                                        <label htmlFor="company" className="input-label" style={{
                                            color:customColors.inputLabel,
                                        }}>Company Name</label>
                                        <input type="text" className="contact-us-input" placeholder="Enter Email Address"
                                            style={{
                                                color:customColors.lightGreyEbco,
                                                border:`1px solid ${customColors.selectBox}`,
                                            }}
                                                {...register("companyName", { validate: value =>
                                            (value && value.trim().length > 0) ||
                                            'Enter Company Name', },)} />

                                </Box> */}
                  </Box>
                  <Box
                    className='input-section column-space-between'
                    sx={{
                      alignItems: 'flex-start',
                    }}
                  >
                    <label
                      htmlFor='email'
                      className='input-label'
                      style={{
                        color: customColors.inputLabel,
                      }}
                    >
                      Email Address*
                    </label>
                    <input
                      type='text'
                      className='contact-us-input'
                      placeholder=''
                      style={{
                        color: customColors.lightGreyEbco,
                        border: `1px solid ${customColors.selectBox}`,
                      }}
                      {...register('email', {
                        required: true,
                        validate: value =>
                          (value && value.trim().length > 0) ||
                          'Enter Email Address',
                      })}
                    />

                    {errors.email?.type === 'required' && (
                      <p role='alert' style={inputError}>
                        Email Address is required
                      </p>
                    )}
                  </Box>
                </Box>
                <Box className='row-space-between input-row'>
                  <Box
                    className='input-section-single column-space-between'
                    sx={{
                      alignItems: 'flex-start',
                      marginBottom: '1rem !important',
                    }}
                  >
                    <label
                      htmlFor='address'
                      className='input-label'
                      style={{
                        color: customColors.inputLabel,
                      }}
                    >
                      Address with pincode*
                    </label>
                    <input
                      id='address'
                      type='text'
                      className='contact-us-input'
                      placeholder=''
                      style={{
                        color: customColors.lightGreyEbco,
                        border: `1px solid ${customColors.selectBox}`,
                      }}
                      {...register('address', {
                        validate: value =>
                          (value && value.toString().trim().length > 0) ||
                          'Enter Address',
                      })}
                    />
                    {errors.address?.type === 'required' && (
                      <p role='alert' style={inputError}>
                        Address is required
                      </p>
                    )}
                  </Box>
                </Box>
                <Box
                  className='row-space-between input-row input-container'
                  mt={1}
                >
                  <Box
                    className='input-section-single column-space-between'
                    sx={{
                      alignItems: 'flex-start',
                    }}
                  >
                    <label
                      htmlFor='Message'
                      className='input-label'
                      style={{
                        color: customColors.inputLabel,
                      }}
                    >
                      Message*
                    </label>
                    <textarea
                      id='message'
                      className='contact-us-input'
                      placeholder=''
                      style={{
                        color: customColors.lightGreyEbco,
                        border: `1px solid ${customColors.selectBox}`,
                        resize: 'none', // Disable resizing
                        padding: '8px', // Optional: Add padding for aesthetics
                      }}
                      rows={8} // Optional: Define the number of rows (height) for the textarea
                      {...register('message', {
                        validate: value =>
                          (value && value.toString().trim().length > 0) ||
                          'Enter Message',
                      })}
                    />
                    {errors.message?.type === 'required' && (
                      <p role='alert' style={inputError}>
                        Message is required
                      </p>
                    )}

                    {/* Display error if the query is not selected */}
                    {/* {errors.query && (
                                        <span style={{ color: 'red' }}>{errors.query.message}</span>
                                    )} */}
                  </Box>
                </Box>
                <button
                  className='submit-btn'
                  type='submit'
                  style={orangeEbcoButton}
                >
                  Submit
                </button>
              </form>
            </Box>
          </Box>
        </Box>
        <Box
          className='important_contact_section w-100'
          sx={{
            background: customColors.skyBlueEbco,
          }}
        >
          {/* <Typography
            className="important_contact_title"
            sx={{
              color: customColors.darkBlueEbco,
              fontFamily: "Uniform Light",
            }}
          >
            IMPORTANT{" "}
            <span
              style={{
                color: customColors.darkBlueEbco,
                fontFamily: "Uniform Bold",
              }}
            >
              CONTACT
            </span>
          </Typography> */}
          <Box
            className='address-flex row-space-between'
            sx={{
              alignItems: 'stretch !important',
            }}
          >
            <Box
              className='headoffice address-flex-box row-center'
              sx={{
                borderColor: customColors.lightGreyEbco,
              }}
            >
              {' '}
              <Box>
                <Box className='address_title'>
                  {/* <Image
                    src="/images/office_address.png"
                    alt="Head office"
                    width={20}
                    height={20}
                  /> */}
                  <ApartmentIcon
                    sx={{
                      color: customColors.darkBlueEbco,
                      width: '20px',
                      height: '20px',
                    }}
                  />
                  <Typography
                    sx={{
                      color: customColors.darkBlueEbco,
                      fontSize: '20px',
                      marginLeft: '1rem',
                      fontFamily: 'Uniform Bold',
                    }}
                  >
                    Head Office
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: customColors.darkBlueEbco,
                    marginTop: '1rem',
                    fontFamily: 'Uniform Medium',
                  }}
                  className='contact-details'
                >
                  Ebco Private Limited <br /> 402-3, Hyde Park, Saki Vihar Road,
                  <br />
                  Opposite Ansa Industrial Estate, Chandivali,
                  <br />
                  Andheri (East), Mumbai - 400 072 <br />
                  CIN NO: U29299MH1973PTC016890
                  <br />
                  Phone: +91-22-6783-7777
                </Typography>
              </Box>
            </Box>
            <Box
              className='headoffice address-flex-box row-center'
              sx={{
                borderColor: customColors.lightGreyEbco,
              }}
            >
              <Box>
                <Box className='address_title'>
                  <Image
                    src='/images/phone.png'
                    alt='Head office'
                    width={14}
                    height={20}
                  />
                  <Typography
                    sx={{
                      color: customColors.darkBlueEbco,
                      fontSize: '20px',
                      marginLeft: '1rem',
                      fontFamily: 'Uniform Bold',
                    }}
                  >
                    Contact Us
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: customColors.darkBlueEbco,
                    marginTop: '1rem !important',
                    fontFamily: 'Uniform Medium',
                  }}
                  className='contact-details'
                >
                  <Typography className='contact-details-row'>
                    <span className='contact-label'>Toll Free: &nbsp;</span>
                    <span
                      className='contact-value'
                      style={{ cursor: 'pointer' }}
                    >
                      <span onClick={() => window.open('tel:+18001201122')}>
                        {' '}
                        1800 120 1122
                      </span>
                    </span>
                  </Typography>
                  <Typography className='contact-details-row'>
                    <span className='contact-value'>
                      (Mon - Sat | 8:30am to 4:45pm)
                    </span>
                  </Typography>
                </Typography>
              </Box>
            </Box>

            <Box
              className='headoffice address-flex-box row-center'
              sx={{
                borderColor: 'transparent',
              }}
            >
              <Box>
                <Box className='address_title'>
                  <Image
                    src='/images/mail.png'
                    alt='Head office'
                    width={25}
                    height={20}
                  />
                  <Typography
                    sx={{
                      color: customColors.darkBlueEbco,
                      fontSize: '20px',
                      marginLeft: '1rem',
                      fontFamily: 'Uniform Bold',
                    }}
                  >
                    Email Address
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: customColors.darkBlueEbco,
                    marginTop: '1rem',
                    fontFamily: 'Uniform Medium',
                  }}
                  className='contact-details'
                >
                  <Typography className='contact-details-row'>
                    <span className='contact-label'>
                      General Enquiries: &nbsp;
                    </span>
                    <span
                      className='underline-decoration'
                      onClick={() => window.open('mailto:info@ebco.in')}
                      style={{ cursor: 'pointer' }}
                    >
                      info@ebco.in
                    </span>
                  </Typography>
                  <Typography className='contact-details-row'>
                    <span className='contact-label'>
                      Service & Quality: &nbsp;
                    </span>
                    <span
                      className='underline-decoration'
                      onClick={() => window.open('mailto:csc@ebco.in')}
                      style={{ cursor: 'pointer' }}
                    >
                      csc@ebco.in
                    </span>
                  </Typography>
                  <Typography className='contact-details-row'>
                    <span className='contact-label'>Online Orders: &nbsp;</span>
                    <span
                      className='underline-decoration'
                      onClick={() => window.open('mailto:online.sales@ebco.in')}
                      style={{ cursor: 'pointer' }}
                    >
                      online.sales@ebco.in
                    </span>
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
    </>
  )
}

export default ContactUs
