import {
  Box,
  Checkbox,
  Typography,
  Button,
  ButtonProps,
  Pagination,
  PaginationItem,
  Modal,
  TextField,
} from '@mui/material'
import './Wishlist.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks'
import { removeProductFromWishlist } from '@/store/wishlist'
import { ProductDetails } from '@/interface/productDetails'
import { convertHtmltoArray, decodeHtml } from '@/utils/convertHtmltoArray'
import { useRouter } from 'next/navigation'
import formatPrice from '@/utils/formatPrice'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'

import {
  containsScreenReaderText,
  extractRegularPrice,
  extractSalePrice,
} from '@/utils/extractPrice'
import { getCategoryByName } from '@/utils/getCategoryByName'
import { apiClient } from '@/apiClient/apiService'
import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { useMutation, useQuery } from '@tanstack/react-query'
import EastIcon from '@mui/icons-material/East'
import WestIcon from '@mui/icons-material/West'
import { WishlistProduct } from '@/interface/wishlist'
import { CgMenuGridO } from 'react-icons/cg'
import { MdTableRows } from 'react-icons/md'
import { SubmitHandler, useForm } from 'react-hook-form'
import { inputError, useEbcoOrangeButtonStyle } from '@/utils/CommonStyling'
import { toast } from 'react-toastify'
interface ShareBookmark {
  title: string
  sender: string
}

const Bookmark = () => {
  const [checkedItems, setCheckedItems] = useState<number[]>([])
  const [isDesktop, setIsDesktop] = useState(false)
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [view, setView] = useState<string>('grid')
  const orangeEbcoButton = useEbcoOrangeButtonStyle()
  const [openShareBookmarkModal, setOpenShareBookmarkModal] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShareBookmark>()
  const handleCheckboxChange = (event: any, id: number) => {
    event.stopPropagation()
    setCheckedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    )
  }

  const wishlistCart = useAppSelector(state => state.wishlist).products
  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>(
    [],
  )

  interface Data {
    product_id: number
  }

  const removeBookmark = async (data: number) => {
    try {
      const response = await apiClient.post<Data, number[]>(
        `${API_ENDPOINT.POST.handleBookmark}/remove`,
        {
          product_id: data,
        },
      )
      return response
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      throw error // Ensure to propagate the error
    }
  }

  interface shareBookmarkPayload {
    title: string
    sender_name: string
  }

  const createProductCollection = async (data: ShareBookmark) => {
    try {
      const response = await apiClient.post<
        shareBookmarkPayload,
        shareBookmarkResponse
      >(`${API_ENDPOINT.POST.createProductCollection}`, {
        title: data.title,
        sender_name: data.sender,
      })
      return response
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      throw error // Ensure to propagate the error
    }
  }

  interface shareBookmarkResponse {
    colllection_id: number
    sender_name: string
    unique_key: string
    shareable_link: string
  }
  const submitShare: SubmitHandler<ShareBookmark> = data => {
    console.log(data)
    mutation.mutate(data)
  }

  const mutation = useMutation({
    mutationFn: createProductCollection,
    onSuccess: (data: shareBookmarkResponse) => {
      // Handle success, e.g., store the token, navigate to another page, etc.
      // if (navigator.clipboard) {
      //   navigator.clipboard
      //     .writeText(data.shareable_link)
      //     .then(() => {
      //       console.log('Text copied to clipboard!')
      //     })
      //     .catch(err => {
      //       console.error('Failed to copy text: ', err)
      //     })
      // } else {
      //   console.error('Clipboard API is not supported in this browser.')
      // }

      if (navigator.share) {
        navigator
          .share({
            url: data.shareable_link, // Use the URL from the API response
          })
          .then(() => console.log('Content shared successfully!'))
          .catch(err => console.error('Error sharing content:', err))
      } else {
        alert('Web Share API is not supported in this browser.')
      }

      reset()
      // toast.success('Collection link copied successfully!', {
      //   position: 'top-right',
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: 'light',
      // })
      handleCloseBookmarkModal()
      // return;
      document.body.classList.remove('loading')
    },
    onError: error => {
      // Handle error, e.g., show an error message to the user
      console.error('Error fetching token:', error)
    },
  })
  const mutationBookmarkRemove = useMutation<number[], Error, number>({
    mutationFn: removeBookmark,
    onSuccess: data => {
      document.body.classList.remove('loading')
      //console.log("Successfully removed from wishlist:", data);
    },
    onError: error => {
      console.error('Error removing from wishlist:', error)
    },
  })

  const shareBookmark = () => {
    setOpenShareBookmarkModal(true)
  }
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  }

  const handleDelete = async (
    event: React.MouseEvent<HTMLElement> | SyntheticEvent,
    id: number,
  ) => {
    event.stopPropagation()
    setWishlistProducts(prev => prev.filter(product => product.id !== id))
    setCheckedItems(prev => prev.filter(item => item !== id))

    try {
      await mutationBookmarkRemove.mutateAsync(id)
      // Optionally, you can dispatch any additional actions after successful removal
      // dispatch(removeProductFromWishlist(id));
    } catch (error) {
      // Handle error if needed
      console.error('Error removing product from wishlist:', error)
    }
  }

  const removeMultipleFromWishlist = async () => {
    const syntheticEvent: SyntheticEvent = {
      stopPropagation: () => {},
      preventDefault: () => {},
    }

    const filteredProducts = wishlistProducts.filter(product =>
      checkedItems.includes(product.id),
    )

    for (const product of filteredProducts) {
      await handleDelete(syntheticEvent, product.id)
    }
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const fetchWishlist = async (): Promise<WishlistProduct[]> => {
    try {
      const response = await apiClient.get<WishlistProduct[]>(
        ` ${API_ENDPOINT.GET.handleBookmark}/get?acf_format=standard&page=${page}&per_page=10`,
      )
      // //console.log(response, "new arrival data");
      if (!response) {
        throw new Error('No data found')
      }
      setTotalPages(response.headers['x-wp-totalpages'])
      console.log(response.data, 'REsponse')
      setWishlistProducts(response.data)
      return response.data
    } catch (error) {
      console.error('Failed to fetch new arrival data', error)
      return [] // Return an empty array if an error occurs
    }
  }

  const wishlistQuery = useQuery({
    queryKey: ['wishlist-listing'],
    queryFn: fetchWishlist,
  })
  useEffect(() => {
    const isDesktopOS = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      return !(
        (
          /android/.test(userAgent) || // Android devices
          /iphone|ipad|ipod/.test(userAgent)
        ) // iOS devices
      )
    }
    if (isDesktopOS()) {
      setIsDesktop(true)
    }
  }, [])

  useEffect(() => {
    //console.log(wishlistCart, "wishlistttt");
    wishlistQuery.refetch()
  }, [page])

  const ColorButton = styled(Button)<ButtonProps>(() => ({
    color: 'white',
    backgroundColor: '#092853',
    '&:hover': {
      backgroundColor: '#092853',
    },
  }))

  // const handleDelete = (
  //   event: React.MouseEvent<HTMLElement> | SyntheticEvent,
  //   id: number
  // ) => {
  //   event.stopPropagation();
  //   setWishlistProducts((prev) => prev.filter((product) => product.id !== id));
  //   setCheckedItems((prev) => prev.filter((item) => item !== id));
  //   mutationBookmarkRemove.mutate(id);
  //   // dispatch(removeProductFromWishlist(id));
  // };
  // const removeMultipleFromWishlist = () => {
  //   const syntheticEvent: SyntheticEvent = {
  //     stopPropagation: () => {},
  //     preventDefault: () => {},
  //   };
  //   const filteredProducts = wishlistProducts.filter((product) =>
  //     checkedItems.includes(product.id)
  //   );

  //   filteredProducts.forEach((product) => {
  //     handleDelete(syntheticEvent, product.id);
  //   });
  // };
  type SyntheticEvent = {
    stopPropagation: () => void
    preventDefault: () => void
  }

  const handleProductClick = (item: WishlistProduct) => {
    const category = getCategoryByName(item.categories)

    if (category) {
      const baseUrl = window.location.origin
      const newUrl = `${baseUrl}/${category.name.toLowerCase()}/${item.slug}`

      router.push(newUrl)
    }
  }

  const handleCloseBookmarkModal = () => {
    setOpenShareBookmarkModal(false)
  }
  return (
    <>
      <Box
        className='column-space-around'
        sx={
          {
            // minHeight: "80vh",
          }
        }
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {isDesktop && (
            <Box className='views-section' sx={{ display: 'flex', gap: 2 }}>
              <CgMenuGridO
                onClick={() => {
                  setView('grid')
                  // setProductDataAPi([])
                  // if (productType === 'SHOP NOW') {
                  //   fetchShopNowData()
                  // } else {
                  //   fetchDataChange()
                  // }
                }}
                color={view === 'grid' ? customColors.darkBlueEbco : '#8D8D8D'}
                className='icon'
              />
              <MdTableRows
                onClick={() => {
                  setView('rows')
                  // setWishlistProducts([])

                  // if (productType === 'SHOP NOW') {
                  //   fetchShopNowData()
                  // } else {
                  //   fetchWishlist()
                  // }
                }}
                color={view === 'rows' ? customColors.darkBlueEbco : '#8D8D8D'}
                className='icon'
              />
            </Box>
          )}
          <Box>
            <ColorButton
              className='wishlist-add-to-cart'
              variant='contained'
              onClick={shareBookmark}
              sx={{
                marginRight: 2,
              }}
            >
              Share
            </ColorButton>

            {/* <ColorButton
              className='wishlist-add-to-cart'
              variant='contained'
              disabled={checkedItems.length === 0}
              onClick={removeMultipleFromWishlist}
            >
              Remove from collection
            </ColorButton> */}
          </Box>
        </Box>

        <Box
          className='wishlist-wrapper'
          sx={{
            minHeight: '55vh',
          }}
        >
          {wishlistProducts && wishlistProducts.length == 0 && (
            <Box
              sx={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant='h6'>No Products Found</Typography>
            </Box>
          )}
          {wishlistProducts &&
            wishlistProducts.length > 0 &&
            wishlistProducts.map((item, index) => (
              <Box
                className='wishlist-container'
                key={index}
                sx={{ width: view === 'grid' && isDesktop ? '32%' : '100%' }}
              >
                <Box className='wishlist-image-container'>
                  {item?.image_urls && (
                    <Image
                      src={item?.image_urls.featured_image}
                      alt='wishlist-image'
                      className='wishlist-image'
                      width={100}
                      height={100}
                      onClick={() => handleProductClick(item)}
                    />
                  )}
                  {/* <Checkbox
                  className='wishlist-checkbox'
                  sx={{
                    color: '#092853',
                    backgroundColor: '#fff',
                    '&.Mui-checked': {
                      color: '#092853',
                    },
                    '&:hover': {
                      backgroundColor: '#fff',
                    },
                  }}
                  checked={checkedItems.includes(item.id)}
                  onChange={event => handleCheckboxChange(event, item.id)}
                /> */}
                </Box>
                <Box className='wishlist-description'>
                  <Box
                    className='title-action row-space-between'
                    sx={{
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box
                      className='title-subtitle'
                      // onClick={() => {
                      //   router.push(decodeURIComponent(item.itemURL));
                      // }}
                    >
                      <Typography className='wishlist-title blue-text single-line'>
                        {decodeHtml(item.name)}
                      </Typography>
                      <Typography
                        className={`wishlist-title ${
                          view === 'grid' ? 'single-line' : ''
                        }`}
                      >
                        {item?.description &&
                          convertHtmltoArray(item?.description).map(
                            (desc, i) => {
                              return (
                                <Typography
                                  key={i}
                                  className='product-description'
                                  sx={{
                                    color: customColors.greyEbco,
                                  }}
                                >
                                  {desc}
                                </Typography>
                              )
                            },
                          )}
                      </Typography>
                    </Box>
                    <Box
                      className='checkbox-container row-center'
                      sx={{
                        marginLeft: '1rem',
                      }}
                    >
                      <Image
                        src='/images/wishlist/delete.svg'
                        alt='wishlist'
                        width={28}
                        height={28}
                        className='wishlist-delete'
                        onClick={event => handleDelete(event, item.id)}
                      />
                    </Box>
                  </Box>
                  {<Box className='wishlist-divider'></Box>}
                  {/* <Box className="price-sontainer">
                {item.has_options &&
                item.on_sale &&
                !containsScreenReaderText(item.price_html) ? (
                  <div
                    className="price"
                    style={{
                      fontSize: "20px !important",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: item.price_html,
                    }}
                  ></div>
                ) : item.has_options &&
                  item.on_sale &&
                  containsScreenReaderText(item.price_html) ? (
                  <>
                    <Typography className="mrp-price">
                      ₹{extractSalePrice(item.price_html)}
                    </Typography>

                    <Typography className="price">
                      ₹{extractRegularPrice(item.price_html)}
                    </Typography>
                  </>
                ) : (
                  item.on_sale && (
                    <>
                      <Typography className="mrp-price">
                        {formatPrice(item.price)}
                      </Typography>
                      {item.regular_price && (
                        <Typography className="price">
                          {formatPrice(item.regular_price)}
                        </Typography>
                      )}
                    </>
                  )
                )}
              </Box> */}
                  {/* {item?.selectedOptions && (
                <Box className="wishlist-divider"></Box>
              )}
              {item?.selectedOptions && (
                <Box className="options-container w-100">
                  {item?.selectedOptions &&
                    Object.entries(item.selectedOptions).map(([key, value]) => (
                      <Box
                        className="option-item row-space-between w-100"
                        key={key}
                      >
                        <Typography className="option-key">{key}</Typography>
                        <Typography className="option-value">
                          : {value}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              )} */}
                </Box>
              </Box>
            ))}
        </Box>
        {/* {wishlistProducts && wishlistProducts!.length > 0 && (
          <Box
            className='row-center'
            sx={{
              margin: '3rem 0',
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              color='standard'
              renderItem={item => (
                <PaginationItem
                  slots={{ previous: WestIcon, next: EastIcon }}
                  {...item}
                />
              )}
            />
          </Box>
        )} */}
      </Box>
      <Modal
        open={openShareBookmarkModal}
        onClose={handleCloseBookmarkModal}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box
          sx={{
            ...style,
            background: customColors.whiteEbco,
            outline: 'none',
            position: 'relative',
            borderRadius: '8px',
          }}
          className='column-center share-box'
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
            onClick={handleCloseBookmarkModal}
          />

          <Typography
            sx={{
              color: customColors.darkBlueEbco,
              fontFamily: 'Uniform Bold',
            }}
            className='visit-center-title'
          >
            Share products
          </Typography>
          <form
            onSubmit={handleSubmit(submitShare)}
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
                <TextField
                  id='name'
                  type='text'
                  className='contact-us-input'
                  placeholder='Title*'
                  size='small'
                  variant='outlined'
                  {...register('title', {
                    required: true,
                    validate: value =>
                      (value && value.trim().length > 0) || 'Enter title',
                  })}
                />
                <TextField
                  id='name'
                  type='text'
                  className='contact-us-input'
                  placeholder='Sender*'
                  size='small'
                  variant='outlined'
                  sx={{
                    marginTop: '1rem',
                  }}
                  {...register('sender', {
                    required: true,
                    validate: value =>
                      (value && value.trim().length > 0) || 'Enter Sender',
                  })}
                />

                {(errors.title?.type === 'required' ||
                  errors.sender?.type === 'required') && (
                  <p role='alert' style={inputError}>
                    Enter All fields
                  </p>
                )}
              </Box>
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
    </>
  )
}

export default Bookmark
