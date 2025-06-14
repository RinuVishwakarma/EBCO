import {
  Box,
  Checkbox,
  Typography,
  Button,
  ButtonProps,
  Pagination,
  PaginationItem,
} from '@mui/material'
import './Wishlist.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { convertHtmltoArray, decodeHtml } from '@/utils/convertHtmltoArray'
import { useRouter } from 'next/navigation'
import { customColors } from '@/styles/MuiThemeRegistry/theme'

import { getCategoryByName } from '@/utils/getCategoryByName'
import { apiClient } from '@/apiClient/apiService'
import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { useMutation, useQuery } from '@tanstack/react-query'
import EastIcon from '@mui/icons-material/East'
import WestIcon from '@mui/icons-material/West'
import { WishlistProduct } from '@/interface/wishlist'
import Link from 'next/link'

const Wishlist = () => {
  const [checkedItems, setCheckedItems] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const router = useRouter()
  const handleCheckboxChange = (event: any, id: number) => {
    event.stopPropagation()
    setCheckedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    )
  }

  const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>(
    [],
  )

  interface Data {
    product_id: number
  }

  const removeWishlist = async (data: number) => {
    try {
      const response = await apiClient.post<Data, number[]>(
        `${API_ENDPOINT.POST.handleWishlist}/remove`,
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

  const mutationWishlistRemove = useMutation<number[], Error, number>({
    mutationFn: removeWishlist,
    onSuccess: data => {
      document.body.classList.remove('loading')
      ////console.log("Successfully removed from wishlist:", data);
    },
    onError: error => {
      console.error('Error removing from wishlist:', error)
    },
  })

  const handleDelete = async (
    event: React.MouseEvent<HTMLElement> | SyntheticEvent,
    id: number,
  ) => {
    event.stopPropagation()
    setWishlistProducts(prev => prev.filter(product => product.id !== id))
    setCheckedItems(prev => prev.filter(item => item !== id))

    try {
      await mutationWishlistRemove.mutateAsync(id)
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
        ` ${API_ENDPOINT.GET.handleWishlist}/get?acf_format=standard&page=${page}&per_page=10`,
      )
      // ////console.log(response, "new arrival data");
      if (!response) {
        throw new Error('No data found')
      }
      setTotalPages(response.headers['x-wp-totalpages'])
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
    wishlistQuery.refetch()
  }, [page])

  const ColorButton = styled(Button)<ButtonProps>(() => ({
    color: 'white',
    backgroundColor: '#092853',
    '&:hover': {
      backgroundColor: '#092853',
    },
  }))

  type SyntheticEvent = {
    stopPropagation: () => void
    preventDefault: () => void
  }

  const handleProductClick = (item: WishlistProduct) => {
    const category = getCategoryByName(item.categories)

    if (category) {
      const baseUrl = window.location.origin
      const newUrl = `/${category.name.toLowerCase()}/${item.slug}`

      console.log('🚀 ~ handleProductClick ~ newUrl:', newUrl)
      return
      router.push(newUrl)
    }
  }

  const getURL = (item: WishlistProduct) => {
    console.log('🚀 ~ getURL ~ item:', item)
    const category = getCategoryByName(item.categories)

    if (category) {
      const baseUrl = window.location.origin
      const newUrl = `${baseUrl}/${category.name.toLowerCase()}/${item.slug}`

      return newUrl
    }
  }

  return (
    <Box
      className='column-space-around'
      sx={
        {
          // minHeight: "80vh",
        }
      }
    >
      <ColorButton
        className='wishlist-add-to-cart'
        variant='contained'
        disabled={checkedItems.length === 0}
        onClick={removeMultipleFromWishlist}
      >
        Remove from wishlist
      </ColorButton>
      <Box
        className='wishlist-wrapper'
        sx={{
          minHeight: '55vh',
        }}
      >
        {wishlistProducts.map((item, index) => (
          <Box className='wishlist-container' key={index}>
            <Link
              prefetch={false}
              href={getURL(item) ?? ''}
              passHref
              key={index}
            >
              <Box
                className='wishlist-image-container'
                onClick={() => handleProductClick(item)}
                sx={{ cursor: 'pointer' }}
              >
                {item?.gallery_image_urls && (
                  <Image
                    src={item?.gallery_image_urls[0]}
                    alt='wishlist-image'
                    className='wishlist-image'
                    width={100}
                    height={100}
                  />
                )}
                <Checkbox
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
                />
              </Box>
            </Link>
            <Box className='wishlist-description'>
              <Box
                className='title-action row-space-between'
                sx={{
                  alignItems: 'flex-start',
                }}
              >
                <Box className='title-subtitle'>
                  <Typography className='wishlist-title blue-text single-line'>
                    {decodeHtml(item.name)}
                  </Typography>
                  <Typography className='wishlist-title single-line'>
                    {item?.description &&
                      convertHtmltoArray(item?.description).map((desc, i) => {
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
                      })}
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
            </Box>
          </Box>
        ))}
      </Box>
      {wishlistProducts && wishlistProducts!.length > 0 && (
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
      )}
    </Box>
  )
}

export default Wishlist
