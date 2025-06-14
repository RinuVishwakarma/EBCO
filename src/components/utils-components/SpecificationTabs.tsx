import React, { useEffect, useState } from 'react'
import { Box, Button, Modal, Tab, Tabs, Typography } from '@mui/material'
import { MetaDataProp } from '@/interface/productDetails'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import { useParams } from 'next/navigation'
import {
  inputError,
  useEbcoBorderBlueButtonStyle,
  useEbcoOrangeButtonStyle,
} from '@/utils/CommonStyling'
import Image from 'next/image'
import { useAppSelector } from '@/store/reduxHooks'
import { useDispatch } from 'react-redux'
import { setUrl } from '@/store/routeUrl'
import { NextRouter, Router, useRouter } from 'next/router'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { SubmitHandler, useForm } from 'react-hook-form'
import { E164Number } from 'libphonenumber-js'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import PhoneInputWithCountrySelect from 'react-phone-number-input'
import { DownloadCAD } from '@/interface/DownloadCAD'
import { apiClient } from '@/apiClient/apiService'
import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import ModelViewer from './ModelVIewer'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      className='custom-tab-panel'
    >
      {value === index && (
        <Box sx={{ p: 1.5 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  )
}
function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

interface SpecificationsTabsProps {
  router: AppRouterInstance
  meta_data: MetaDataProp[]
  value: number
  productName: string
  handleChange: (event: React.SyntheticEvent, newValue: number) => void
  getTabLabel: (key: string) => string
}
interface ContactFormResponse {
  contact_form_id: number
  status: string
  message: string
  posted_data_hash: string
  into: string
  invalid_fields: InvalidField[] // Since it's an empty array, you can use `any[]`. If there are specific types for invalid fields, adjust accordingly.
}
interface InvalidField {
  field: string
  message: string
  idref: string | null
  error_id: string
}
interface Cad {
  cad_files?: string[]
  file: string
  title: string
  show_3d: boolean
  show_ar: boolean
}

const downloadCadFile = async (fileUrl: any, fileName: any) => {
  try {
    const response = await fetch(fileUrl)
    if (!response.ok) throw new Error('File download failed')

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)

    a.click()
    document.body.removeChild(a)

    // Clean up the URL object
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading file:', error)
  }
}

const SpecificationsTabs: React.FC<SpecificationsTabsProps> = ({
  router,
  meta_data,
  productName,
  value,
  handleChange,
  getTabLabel,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DownloadCAD>()
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  }
  const params = useParams()
  const orangeEbcoButton = useEbcoOrangeButtonStyle()
  const auth = useAppSelector(state => state.auth).isLoggedIn
  const dispatch = useDispatch()
  const ebcoBorderBlueButtonStyle = useEbcoBorderBlueButtonStyle()
  const [modelData, setModelData] = useState<Cad[]>([])
  const [showCadTab, setShowCadTab] = useState(true)
  const [contact, setContact] = useState<E164Number | undefined>(undefined)
  const [openForm, setOpenForm] = useState<boolean>(false)
  const [cadFile, setCadFile] = useState<string>('')
  const [contactError, setContactError] = useState(false)
  const [modelSelected, setModelSelected] = useState<Cad>()
  const [openCadMenu, setopenCadMenu] = React.useState<null | HTMLElement>(null)
  const open = Boolean(openCadMenu)
  const handleMenuDropClick = (event: React.MouseEvent<HTMLElement>) => {
    setopenCadMenu(event.currentTarget)
  }
  const handleClose = () => {
    setopenCadMenu(null)
  }

  const getLastPartCAD = (url: string, isDownload?: boolean) => {
    if (isDownload) {
      const filename = url.split('/').pop()
      return filename
    }

    const fileExtension = url.split('/').pop()?.split('.') || []

    return fileExtension.length > 1
      ? fileExtension[fileExtension.length - 1].toUpperCase()
      : ''
  }

  const handleModelData = (
    event: React.ChangeEvent<HTMLSelectElement> | any,
  ) => {
    let model: Cad | undefined = {
      file: '',
      title: '',
      show_3d: false,
      show_ar: false,
    }
    if (event.target.value !== '') {
      model = modelData?.find(data => data.file === event.target.value)
      setModelSelected(prev => (prev = model))
    }
  }
  const handleChangeContact = (value: any) => {
    setContact(value)
  }
  const onSubmit: SubmitHandler<DownloadCAD> = data => {
    if (!contact) {
      setContactError(true)
      return
    }

    mutation.mutate(data)
  }
  const sendQuery = async (data: DownloadCAD) => {
    try {
      const response = await apiClient.post<
        DownloadCAD,
        ContactFormResponse | any
      >(
        `${API_ENDPOINT.POST.sendQuery}/25254/feedback`,
        {
          _wpcf7_unit_tag: 'cad_data_form',
          product_name: productName,
          // email: data.email,
          fullname: data.fullname,
          mobile: contact!,
          company: data.company,
          designation: data.designation,
        },
        {
          headers: {
            'content-type': 'multipart/form-data',
          },
        },
      )
      return response
    } catch {
      return {} as ContactFormResponse
    }
  }

  const mutation = useMutation({
    mutationFn: sendQuery,
    onSuccess: data => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      if (data.status === 'mail_sent') {
        setContact(undefined)

        setOpenForm(false)
        toast.success('Query submitted successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })

        downloadCadFile(cadFile, getLastPartCAD(cadFile, true))
      } else {
        if (data.invalid_fields[0].field)
          toast.error(`Please enter valid  ${data.invalid_fields[0].field}`, {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          })
      }
      // return;
      document.body.classList.remove('loading')
    },
    onError: error => {
      // Handle error, e.g., show an error message to the user
      console.error('Error fetching token:', error)
    },
  })

  const handleDownloadCAD = (item: string) => {
    console.log(item)
    console.log(modelSelected?.file)
    setCadFile(item)
    if (!auth) {
      // const currentUrl = window.location.pathname + window.location.search
      const currentUrl = window.location.href
      dispatch(
        setUrl({
          url: currentUrl,
        }),
      )

      localStorage.setItem('url', currentUrl)
      router.push('/login')
    } else {
      setOpenForm(prev => (prev = true))
    }
  }
  const getTitle = (model: string) => {
    let title = modelData?.filter(data => data.file === model)
    if (title) return title[0]?.title
    else return ''
  }
  useEffect(() => {
    console.log('Meta Data is', meta_data, params.slug)
    const cadDataEntry = meta_data.find(entry => entry.key == 'cad data') as
      | { value: Cad[] }
      | undefined
    const cadData = cadDataEntry ? cadDataEntry.value : []
    setModelData(prev => (prev = cadData))
    if (cadData.length > 0) {
      let defaultModelValue = cadData[0]
      setModelSelected(prev => (prev = defaultModelValue))
    }
    const allShow3DFalse =
      cadData.length > 0 && cadData.every(item => item.show_3d === false)
    if (allShow3DFalse) {
      setShowCadTab(false)
    }
  }, [meta_data])
  return (
    <>
      {meta_data.length > 0 && (
        <Box
          className='specifications-description-tabs-container desktop-view'
          sx={{ display: 'flex' }}
        >
          {/* Tabs */}
          <Tabs
            orientation='vertical'
            variant='scrollable'
            value={value}
            onChange={handleChange}
            aria-label='Vertical Tabs'
            sx={{ borderRight: 1, borderColor: 'divider' }}
            className='custom-tabs'
          >
            {meta_data.map((item, index) => (
              <Tab
                key={item.id}
                label={
                  getTabLabel(item.key).toLowerCase().includes('cad') &&
                  showCadTab
                    ? `${getTabLabel(item.key)
                        .split(' ')[0]
                        .toLocaleUpperCase()} ${
                        getTabLabel(item.key).split(' ')[1]
                      }`
                    : !getTabLabel(item.key).toLowerCase().includes('cad')
                    ? getTabLabel(item.key)
                    : null
                }
                {...a11yProps(index)}
                className='custom-tab'
              />
            ))}
          </Tabs>

          {/* Tab Panels */}
          {meta_data.map((item, index) => (
            <TabPanel value={value} index={index} key={item.id}>
              {!getTabLabel(item.key).toLowerCase().includes('cad') ? (
                <Box>
                  <Typography
                    className='product-details-title'
                    sx={{
                      textTransform: 'capitalize',
                    }}
                  >
                    {getTabLabel(item.key)}
                  </Typography>
                  <div
                    dangerouslySetInnerHTML={{ __html: item.value }}
                    className='custom-panel meta-table'
                  />
                </Box>
              ) : showCadTab ? (
                <Box>
                  <Modal
                    open={openForm}
                    onClose={() => setOpenForm(false)}
                    aria-labelledby='parent-modal-title'
                    aria-describedby='parent-modal-description'
                  >
                    <Box
                      sx={{
                        ...style,
                        width: '50vw',
                        background: customColors.whiteEbco,
                        outline: 'none',
                        borderRadius: '8px',
                      }}
                      className='column-center'
                    >
                      <CancelOutlinedIcon
                        sx={{
                          color: customColors.darkBlueEbco,
                          position: 'absolute',
                          top: '2rem',
                          right: '2rem',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                        }}
                        className='visit-center-close'
                        onClick={() => setOpenForm(false)}
                      />
                      <Image
                        src={'/images/darkLogoEbco.webp'}
                        alt='Ebco Logo'
                        width={100}
                        height={70}
                      />
                      <Typography
                        sx={{
                          color: customColors.darkBlueEbco,
                          fontFamily: 'Uniform Bold',
                        }}
                        className='visit-center-title'
                      >
                        Fill in Your Details
                      </Typography>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='column-center w-100'
                        style={{}}
                      >
                        <Box className='row-space-between input-row w-100'>
                          <Box
                            className='input-section column-space-between w-100'
                            sx={{
                              alignItems: 'flex-start',
                              margin: '0 !important',
                              marginRight: '1rem !important',
                            }}
                          >
                            <input
                              id='name'
                              type='text'
                              className='contact-us-input'
                              placeholder='Full Name*'
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
                          </Box>
                        </Box>

                        <Box className='row-space-between input-row w-100'>
                          <Box
                            className='input-section column-space-between'
                            sx={{
                              alignItems: 'flex-start',
                              flex: '1',
                            }}
                          >
                            <PhoneInputWithCountrySelect
                              international
                              countryCallingCodeEditable={false}
                              defaultCountry='IN'
                              value={contact}
                              {...(register('mobile'),
                              {
                                required: true,
                                validate: (value: any) => {
                                  return (
                                    (value &&
                                      value.toString().trim().length > 0) ||
                                    'Enter Contact Number'
                                  )
                                },
                              })}
                              onChange={handleChangeContact}
                              className='phone-input-custom-form'
                            />

                            {contactError && (
                              <p role='alert' style={inputError}>
                                Enter Valid Contact Number
                              </p>
                            )}
                          </Box>
                        </Box>
                        <Box
                          className='input-section-query column-space-between w-100'
                          sx={{
                            alignItems: 'flex-start',
                          }}
                        >
                          <input
                            id='company'
                            type='text'
                            className='contact-us-input'
                            placeholder='Enter company*'
                            style={{
                              color: customColors.lightGreyEbco,
                              border: `1px solid ${customColors.selectBox}`,
                            }}
                            {...register('company', {
                              required: true,
                              validate: value =>
                                (value && value.trim().length > 0) ||
                                'Enter company',
                            })}
                          />

                          {errors.company?.type === 'required' && (
                            <p role='alert' style={inputError}>
                              Company is required
                            </p>
                          )}
                        </Box>

                        <Box
                          className='input-section-query column-space-between w-100'
                          sx={{
                            alignItems: 'flex-start',
                            margin: '0 !important',
                          }}
                        >
                          <input
                            id='designation'
                            type='text'
                            className='contact-us-input'
                            placeholder='Enter designation*'
                            style={{
                              color: customColors.lightGreyEbco,
                              border: `1px solid ${customColors.selectBox}`,
                            }}
                            {...register('designation', {
                              required: true,
                              validate: value =>
                                (value && value.trim().length > 0) ||
                                'Enter designation',
                            })}
                          />

                          {errors.designation?.type === 'required' && (
                            <p role='alert' style={inputError}>
                              Designation is required
                            </p>
                          )}
                        </Box>

                        <button
                          className='submit-btn'
                          type='submit'
                          style={{ ...orangeEbcoButton, marginTop: '2rem' }}
                        >
                          Submit
                        </button>
                      </form>
                    </Box>
                  </Modal>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography
                      className='product-details-title'
                      sx={{
                        textTransform: 'capitalize',
                        mb: '0 !important',
                      }}
                    >
                      {`${getTabLabel(item.key)
                        .split(' ')[0]
                        .toLocaleUpperCase()}
                      ${getTabLabel(item.key).split(' ')[1]}`}
                    </Typography>
                    <Box id='ar-image-container'>
                      <Box className='row-center'>
                        <Button
                          className='add-to-cart-button blue-border-button download-brochure-button-hide w-50'
                          onClick={handleMenuDropClick}
                          sx={{
                            lineHeight: '1.2 !important',
                            width: '100%',
                            px: '1rem !important',
                          }}
                        >
                          <Image
                            src={'/images/download-pdf.svg'}
                            alt='cart'
                            width={20}
                            height={20}
                            className='cart-icon'
                          />
                          Download CAD
                        </Button>
                        <Menu
                          id='demo-positioned-menu'
                          aria-labelledby='demo-positioned-button'
                          anchorEl={openCadMenu}
                          open={open}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                          }}
                          sx={{
                            // Remove the backdrop blur
                            '& .MuiBackdrop-root': {
                              backdropFilter: 'none',
                              backgroundColor: 'transparent', // Ensure background color is transparent if you don't want any backdrop effect.
                            },
                          }}
                        >
                          {modelSelected &&
                            modelSelected.cad_files &&
                            modelSelected.cad_files.map(item => (
                              <MenuItem
                                key={item}
                                onClick={() => {
                                  handleClose()
                                  handleDownloadCAD(item)
                                }}
                                sx={{ minWidth: 80, justifyContent: 'center' }}
                              >
                                {getLastPartCAD(item)}
                              </MenuItem>
                            ))}
                        </Menu>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    id='ar-container'
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Typography
                      className='product-details-title'
                      sx={{
                        textTransform: 'capitalize',
                        mb: '1rem !important',
                      }}
                    >
                      {modelSelected && getTitle(modelSelected?.title)}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: 'column',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 3,
                          // width: '15%',
                        }}
                        className=''
                      >
                        <Typography
                          sx={{
                            pt: 0.5,
                            // width: '30%',
                            color: '#8D8D8D',
                          }}
                        >
                          Select
                        </Typography>
                        <select
                          id='sort-by-select'
                          style={{
                            padding: '0.5rem 1rem',
                            height: 'max-content',
                            width: 'auto',
                            border: '1px solid',
                            borderColor: customColors.darkBlueEbco,
                            fontSize: '16px !important',
                            fontFamily: 'Uniform Medium',
                            color: customColors.darkBlueEbco,
                            borderRadius: '100px',
                          }}
                          value={modelSelected?.file}
                          onChange={handleModelData}
                        >
                          {modelData &&
                            modelData
                              .filter(opt => opt.show_3d)
                              .map(option => (
                                <option
                                  className='option-product'
                                  key={option.title}
                                  value={option.file}
                                >
                                  {option.title}
                                </option>
                              ))}
                        </select>
                      </Box>
                    </Box>
                  </Box>
                  {modelSelected ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <ModelViewer
                        src={modelSelected.file}
                        ar={false}
                        style={{
                          width: '100%',
                          height: '60vh',
                          display: 'flex',
                          touchAction: 'none',
                        }}
                      />
                    </Box>
                  ) : (
                    <>
                      <Box
                        sx={{
                          height: '30vh',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant='h6' align='center'>
                          No Model Selected
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              ) : (
                <></>
              )}
            </TabPanel>
          ))}
        </Box>
      )}
    </>
  )
}

export default SpecificationsTabs
