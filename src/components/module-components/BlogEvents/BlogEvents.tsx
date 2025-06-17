'use client'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import {
  Box,
  Chip,
  FormControlLabel,
  Link,
  ListItem,
  Pagination,
  PaginationItem,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { getCategoryByName } from '@/utils/getCategoryByName'
import './BlogEvents.css'
import '../Product/Product.css'
import { NewProduct, NewProductDetails } from '@/interface/NewProductDetails'
import {
  useRouter as useNextRouterNav,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { useAppDispatch } from '@/store/reduxHooks'

import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { apiClient } from '@/apiClient/apiService'
// import ProductCardColumn from '@/utils/ProductCard/ProductCardColumn'
import EastIcon from '@mui/icons-material/East'
import WestIcon from '@mui/icons-material/West'

import useDebounce from '@/hooks/useDebounce'

import { MenuItem, MenuProp } from '@/interface/MenuData'
import BlogCard from '@/utils/BlogCard/BlogCard'
import BlogOne from './MainBlog'
import MainBlog from './MainBlog'
import BlogCardMobile from '@/utils/BlogCard/BlogCardMobile'
import './BlogEvents.css'
import DoneIcon from '@mui/icons-material/Done'
import { Blogs } from '@/interface/Blog'
import { useQuery } from '@tanstack/react-query'
import { BlogsCategories, NewsEventCategory } from '@/interface/VideosTab'
import Loader from '@/components/utils-components/Loader'

interface pdfUrl {
  pdf_url: string
}

interface filter {
  name: string
  id: number
}
interface Category {
  id: number
  label: string
  route: string
  children: SubCategory[]
  isChecked: boolean
}

interface SubCategory {
  id: number
  label: string
  route: string
  isChecked: boolean
  parentId?: number
  children?: SubCategory[]
}

const BlogEvents = () => {
  const [chipData, setChipData] = useState<BlogsCategories[]>()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const query = useSearchParams()
  const [searchValue, setSearchValue] = useState<string>('')
  const searchValueDebounce = useDebounce<string>(searchValue, 100)
  const [selectedOption, setSelectedOption] = useState<string>('Newly Added')
  const options = ['Newly Added', 'Name : A to Z', 'Name : Z to A']
  const [searchedProducts, setSearchedProducts] = useState<Blogs[] | []>([])
  const [totalPages, setTotalPages] = useState(0)
  const [apiCompleted, setApiCompleted] = useState(false)
  const [blogDataApi, setBlogDataApi] = useState<Blogs[]>([])
  const [featureBlogApi, setFeatureBlogApi] = useState<Blogs[]>([])
  const [queryString, setQueryString] = useState<string>(
    '&order=desc&orderby=date',
  )
  const [checkedSubCategoryIdsString, setCheckedSubCategoryIdsString] =
    useState<string>('')
  const RestrictedFilterIds = [755, 756, 743, 723]
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [filters, setFilters] = useState<string>('')
  const [page, setPage] = React.useState(1)
  const [selectedItem, setSelectedItem] = useState('')
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [blogValue, setBlogValue] = useState(0)
  const [category, setCategory] = useState<string | undefined>(undefined)

  const theme = useTheme()

  const per_page = 12
  const queryOptions = options.reduce((acc, option) => {
    let queryString = ''

    switch (option) {
      case 'Name : A to Z':
        queryString = '&order=asc&orderby=title'
        break
      case 'Name : Z to A':
        queryString = '&order=desc&orderby=title'
        break
      case 'Price: Low to High':
        queryString = '&order=asc&orderby=price'
        break
      case 'Price: High to Low':
        queryString = '&order=desc&orderby=price'
        break
      case 'Newly Added':
        queryString = '&order=desc&orderby=date'
        break
      case 'Default':
      default:
        queryString = ''
        break
    }

    acc[option] = queryString
    return acc
  }, {} as Record<string, string>)
  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement> | any,
  ) => {
    const selected = event.target.value
    setSelectedOption(selected)
    setQueryString(queryOptions[selected])
  }
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const currentUrl = new URL(window.location.href)
    const searchParams = new URLSearchParams(currentUrl.search)
    searchParams.set('page', value.toString())
    currentUrl.search = searchParams.toString()
    window.history.pushState(null, '', currentUrl.toString())
    setPage(value)
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    setSearchValue(value)
  }
  const handleProductClick = (data: Blogs) => {
    setSelectedItem(data.id.toString())
    router.push(`/blogs-articles/${data.slug}`)
  }

  const getSelectedItemChecked = (
    categories: Category[],
    subCategories: SubCategory[],
  ) => {
    const item = query.get('selectedItem')?.replace(/_/g, ' ')
    // console.log(item, "ITTTtttttteeeemmmmmm")
    if (item) {
      // Decode the item from URI encoding
      const decodedItem = decodeURIComponent(item)

      // Find the corresponding category based on the decoded item label
      const selectedCategory = categories.find(
        category => category.label === decodedItem,
      )
      //console.log(selectedCategory);
      // Set the isChecked property of the selected category to true
      if (selectedCategory) {
       
        selectedCategory.isChecked = true

        // Find and update isChecked property of all subcategories belonging to the selected category
        const subCategoriesToUpdate = subCategories.filter(
          subCategory => subCategory.parentId === selectedCategory.id,
        )
        subCategoriesToUpdate.forEach(subCategory => {
          subCategory.isChecked = true
        })
      } else {
        // Find the subcategory with the decoded label
        const selectedSubCategory = subCategories.find(subCategory => {
          const splitLabel = subCategory.label.split('→')
          return (
            splitLabel[0]?.trim() === decodedItem.trim() ||
            splitLabel[1]?.trim() === decodedItem.trim()
          )
        })

        if (selectedSubCategory) {
          // Find the parent category of the selected subcategory
          const parentCategory = categories.find(
            category => category.id === selectedSubCategory.parentId,
          )

          if (parentCategory) {
            // Update the isChecked property of the parent category
            parentCategory.isChecked = true

            // Update the isChecked property of the selected subcategory
            selectedSubCategory.isChecked = true
          }
        }
      }
    } else if (item === null) {
      subCategories.forEach(subCategory => {
        subCategory.isChecked = true
      })
    }

    let checkedSubCategoryIdsString = subCategories
      .filter(subCategory => subCategory.isChecked)
      .map(subCategory => subCategory.id)
      .join(',')

    let checkedCategoriesIdsString = categories
      .filter(category => category.isChecked)
      .map(category => category.id)
      .join(',')
    setCheckedSubCategoryIdsString(checkedSubCategoryIdsString)
  }

  const fetchCategories = async (): Promise<BlogsCategories[] | []> => {
    try {
      const response = await apiClient.get<BlogsCategories[]>(
        `${API_ENDPOINT.GET.getBlogsCategory}`,
      )

      if (!response || !response.data) {
        throw new Error('No data found')
      }
      console.log(response.data, 'BLOG CATEGORIES')
      setChipData(prev => (prev = response.data))
      return response.data
    } catch (error) {
      console.error('Failed to fetch new arrival data:', error)
      return []
    }
  }

  const fetchBlogData = async (searchString: string): Promise<Blogs[] | []> => {
    //console.log("id", id, "name ", name);
    try {
      const response = await apiClient.get<Blogs[]>(
        `${API_ENDPOINT.GET.getBlogs}?${
          filters !== '' ? `categories=${filters}&` : ''
        }per_page=12&page=${page}&search=${searchValueDebounce}&acf_format=standard${queryString}`,
      )

      const featuredResponse = await apiClient.get<Blogs[]>(
        `${API_ENDPOINT.GET.getBlogs}?&acf_format=standard&featured=true`,
      )
      if (!response || !response.data) {
        throw new Error('No data found')
      }

      let totalPages = response.headers['x-wp-totalpages']
      if (totalPages) {
        setTotalPages(totalPages)
      }
      setFeatureBlogApi(prev => (prev = featuredResponse.data))
      return response.data
    } catch (error) {
      console.error('Failed to fetch new arrival data:', error)
      return []
    }
  }
  const fetchBlogsQuery = useQuery({
    queryKey: ['blogs-query', searchValue],
    queryFn: () => fetchBlogData(searchValue),
  })
  const { isLoading, isFetching, data, error } = fetchBlogsQuery

  const findItemByLabel = (
    data: MenuItem[],
    label: string,
  ): MenuItem | undefined => {
    for (const item of data) {
      if (item?.label === label) {
        return item
      }
      if (item?.children) {
        const result = findItemByLabel(item?.children, label)
        if (result) {
          return result
        }
      }
    }
    return undefined
  }
  const fetchData = async (searchString: string) => {
    //console.log(id, name);
    const blogsCategoryData = await fetchBlogsQuery.refetch()
    setTotalPages(totalPages)
    console.log(blogsCategoryData)
    //console.log("VIDEO API CALLED", blogsCategoryData.data);
    if (!blogsCategoryData.data) return
    setBlogDataApi(blogsCategoryData.data)
  }

  // const fetchDataChange = async () => {

  //   const productData = await fetchProductData(
  //     'category',
  //     '27',
  //     '30,31,32,33,34,35,121,37,38,39,40,117,118,119,61,62,63,64,65,66,67,68,69,70,71,72,73,42,43,44,45,47,46,51,49,50,53,54,55,57,58,111,790,791,113,114,115,786',
  //   )
  //   setProductDataAPi(productData)
  // }
  const handleClick = (index: number) => {
    if (chipData) {
      const id = chipData[index].id
      console.log('Id', id)
      setSelectedIds(prev => {
        // Check if the ID is already selected
        if (prev.includes(id)) {
          // If selected, remove it
          return prev.filter(selectedId => selectedId !== id)
        } else {
          // Otherwise, add it
          return [...prev, id]
        }
      })
    }

    console.log(selectedIds)
  }
  useEffect(() => {
    fetchData('')
    fetchCategories()
  }, [])
  useEffect(() => {
    const val = selectedIds.join(',')
    setFilters(prev => (prev = val))
  }, [selectedIds])
  useEffect(() => {
    fetchData('')
    fetchCategories()
  }, [searchValueDebounce, page, queryString, filters, filters])

  return (
    <>
      {/* {blogValue !== 0 && <MainBlog blogValue={blogValue} />} */}
      {blogValue == 0 && (
        <Box className='blog-listing'>
          <Typography
            className='brochure-title'
            sx={{
              color: customColors.darkBlueEbco,
              my: '0 !important',
              p: 4,
              [theme.breakpoints.down('sm')]: {
                p: 2,
              },
            }}
          >
            BLOGS & ARTICLES
          </Typography>
          <Box
            className='blog-section'
            sx={{ marginBottom: totalPages <= 1 ? '3rem' : '' }}
          >
            <Box className='search-filter-section row-space-between'>
              <Box
                className='header-search-section header-search-section-mobile row-center'
                sx={{
                  margin: '0',
                  border: `1px solid ${customColors.lightGreyEbco}`,
                  borderRadius: '50px',
                  position: 'relative',
                  justifyContent: 'flex-start',
                }}
              >
                <SearchIcon
                  sx={{
                    color: customColors.darkBlueEbco,
                  }}
                />

                <input
                  type='text'
                  name='search'
                  value={searchValue}
                  placeholder='Search'
                  id='search'
                  className='w-100 custom-search-header-input'
                  autoComplete='off'
                  onChange={e => {
                    handleInputChange(e)
                  }}
                />
                {searchValue && (
                  <CloseOutlinedIcon
                    sx={{
                      color: customColors.darkBlueEbco,
                      cursor: 'pointer',
                      position: 'absolute',
                      right: '1rem',
                      height: '16px',
                      width: '16px',
                    }}
                    onClick={() => {
                      setSearchValue('')
                      setSearchedProducts([])
                    }}
                  />
                )}

                {searchedProducts && searchedProducts.length > 0 && (
                  <Box
                    className='searched-products-section'
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      marginTop: '0.5rem',
                      left: 0,
                      width: '100%',
                      maxHeight: '50vh',
                      height: 'max-content',
                      backgroundColor: customColors.whiteEbco,
                      borderRadius: '16px',
                      boxShadow: '1px 1px 10px 1px #00000010',
                      padding: '1rem 0rem',
                      zIndex: '3',
                      overflow: 'auto',
                    }}
                  >
                    <Box
                      className='searched-products-container'
                      sx={{
                        padding: '0rem',
                        overflow: 'auto',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      <Box>
                        {searchedProducts.length > 0 &&
                          searchedProducts?.map((item, index) => {
                            return (
                              <Box
                                className='row-space-between searched-product'
                                sx={{
                                  padding: '0.5rem 1rem',
                                  borderBottom: '1px solid #00000010',
                                  alignItems: 'flex-start',
                                  cursor: 'pointer',
                                }}
                                key={index}
                                onClick={() => {
                                  handleProductClick(item)
                                }}
                              >
                                <Typography
                                  className='search-product-title'
                                  sx={{
                                    color: customColors.darkBlueEbco,
                                    fontSize: '14px !important',
                                  }}
                                >
                                  {item.title.rendered}
                                </Typography>
                              </Box>
                            )
                          })}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>

              <Box className='row-space-between sort-filter-section'>
                <Typography
                  sx={{
                    width: '30%',
                    color: '#8D8D8D',
                  }}
                >
                  Sort by:
                </Typography>
                <select
                  id='sort-by-select'
                  style={{
                    padding: '0.5rem 1rem',
                    borderColor: customColors.selectBox,
                    fontSize: '16px !important',
                    fontFamily: 'Uniform Medium',
                    color: customColors.darkBlueEbco,
                    borderRadius: '100px',
                  }}
                  value={selectedOption}
                  onChange={handleSortChange}
                >
                  {options.map(option => (
                    <option
                      className='option-product'
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </Box>
            </Box>
            <Box
              className='views-filters row-space-between'
              sx={{
                margin: '1rem 0',
              }}
            >
              <Box sx={{ display: 'flex', overflow: 'auto' }}>
                {chipData?.map((data, index) => {
                  const isSelected = selectedIds.includes(data.id)
                  return (
                    <ListItem
                      sx={{ m: '0px !important', mb: '0.25rem !important' }}
                      key={data.name}
                    >
                      <Chip
                        variant='outlined'
                        clickable
                        deleteIcon={isSelected ? <DoneIcon /> : <></>}
                        label={data.name}
                        sx={{
                          backgroundColor: isSelected ? '#E7F5FF' : '',
                          color: '#03247D',
                          fontWeight: 700,
                        }}
                        onDelete={() => handleClick(index)}
                        onClick={() => handleClick(index)}
                      />
                    </ListItem>
                  )
                })}
              </Box>
            </Box>
            <Box className='products-container'>
              {(isLoading || isFetching) && <Loader />}
              {!isFetching &&
                blogDataApi.map((data, index) => {
                  return (
                    <>
                      <BlogCard
                        key={index}
                        data={data}
                        selectedItem={selectedItem}
                        handleProductClick={handleProductClick}
                      />
                    </>
                  )
                })}
              {!isFetching && blogDataApi.length == 0 && (
                <Box
                  className='row-center w-100'
                  sx={{
                    margin: '3rem 0',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '24px',
                      fontFamily: 'Uniform Bold !important',
                      color: customColors.darkBlueEbco,
                      textAlign: 'center',
                    }}
                  >
                    No Blogs Found
                  </Typography>
                </Box>
              )}
            </Box>

            <Box className='products-container-mobile'>
              {(isLoading || isFetching) && <Loader />}
              {!isFetching &&
                blogDataApi.map((data, index) => {
                  return (
                    <BlogCardMobile
                      key={index}
                      data={data}
                      selectedItem={selectedItem}
                      handleProductClick={handleProductClick}
                    />
                  )
                })}
              {blogDataApi.length == 0 && (
                <Box
                  className='row-center w-100'
                  sx={{
                    margin: '3rem 0',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '24px',
                      fontFamily: 'Uniform Bold !important',
                      color: customColors.darkBlueEbco,
                      textAlign: 'center',
                    }}
                  >
                    No Blogs Found
                  </Typography>
                </Box>
              )}
            </Box>

            {totalPages > 1 && (
              <Box
                className='row-center'
                sx={{
                  margin: '3rem 0',
                }}
              >
                <Pagination
                  count={Number(totalPages)}
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
        </Box>
      )}
    </>
  )
}

export default BlogEvents
