'use client'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import {
  Box,
  Button,
  Chip,
  ListItem,
  Pagination,
  PaginationItem,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch } from '@/store/reduxHooks'

import { API_ENDPOINT } from '@/apiClient/apiEndpoint'
import { apiClient } from '@/apiClient/apiService'
import EastIcon from '@mui/icons-material/East'
import WestIcon from '@mui/icons-material/West'

import useDebounce from '@/hooks/useDebounce'

import { MenuItem } from '@/interface/MenuData'

import DoneIcon from '@mui/icons-material/Done'
import { Blogs } from '@/interface/Blog'
import { useQuery } from '@tanstack/react-query'
import { BlogsCategories } from '@/interface/VideosTab'
import Loader from '@/components/utils-components/Loader'
import { DownloadBrochure } from '@/interface/DownloadBrochure'
import DesignerCard from '@/components/module-components/DesignerInspiration/DesignerCard'
import './DesignerInspiration.css'
import Masonry from 'react-masonry-css'

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

const DesignerInspiration = () => {
  const [chipData, setChipData] = useState<BlogsCategories[]>()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const query = useSearchParams()
  const [searchValue, setSearchValue] = useState<string>('')
  const searchValueDebounce = useDebounce<string>(searchValue, 100)
  const [selectedOption, setSelectedOption] = useState<string>('Newly Added')
  const options = ['Newly Added', 'Name : A to Z', 'Name : Z to A']
  const [searchedProducts, setSearchedProducts] = useState<
    DownloadBrochure[] | []
  >([])
  const [totalPages, setTotalPages] = useState(0)
  const [blogDataApi, setBlogDataApi] = useState<DownloadBrochure[]>([])
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

  const [posts, setPosts] = useState<DownloadBrochure[]>([])
  const [loadedIds, setLoadedIds] = useState(new Set())

  const theme = useTheme()

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

    setPosts([])
    setPage(1)
    setLoadedIds(new Set<any>())
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
  const handleProductClick = (item: Blogs) => {
    console.log('🚀 ~ handleProductClick ~ item:', item)
    const randomValue = Math.floor(Math.random() * 3) + 1
    console.log(randomValue, 'Value')
    router.push(`/blogs-articles/${item.id}`)
    // const category = getCategoryByName(item.categories)
    ////console.log(category, "category");
    // if (category) {
    // let url = `${category.name.toLowerCase()}/${item.slug}`
    // router.push(url)
    // setSearchValue('')
    // dispatch(
    //   setDrawerOpen({
    //     isOpen: false,
    //   }),
    // )
    // }
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
        // Update the isChecked property of the selected category
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
        `${API_ENDPOINT.GET.getDesignerInspirationCategory}`,
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

  const fetchDesignerInspirationData = async () => {
    try {
      const response = await apiClient.get<DownloadBrochure[]>(
        `${API_ENDPOINT.GET.getDesignersInspiration}?${
          filters !== '' ? `designer-inspiration-category=${filters}&` : ''
        }per_page=15&page=${page}&search=${searchValueDebounce}&acf_format=standard${queryString}`,
      )

      if (!response || !response.data) {
        throw new Error('No data found')
      }

      let resTotalPages = response.headers['x-wp-totalpages']

      setTotalPages(resTotalPages)

      // Filter out posts that are already loaded
      const uniquePosts = response.data.filter(post => !loadedIds.has(post.id))

      // Append the unique posts to the existing ones
      setPosts(prevPosts => [...prevPosts, ...uniquePosts])

      // Update the Set of loaded IDs
      setLoadedIds(prevIds => {
        const updatedIds = new Set(prevIds)
        uniquePosts.forEach(post => updatedIds.add(post.id))
        return updatedIds
      })

      return response.data
    } catch (error) {
      console.error('Failed to fetch new arrival data:', error)
      return []
    }
  }

  const fetchDesignerInspirationQuery = useQuery({
    queryKey: ['desginer-inspiration-query'],
    queryFn: () => fetchDesignerInspirationData(),
  })

  const fetchData = async () => {
    const designerInspirationData =
      await fetchDesignerInspirationQuery.refetch()
    if (!designerInspirationData.data) return
    setBlogDataApi(designerInspirationData.data)
  }

  useEffect(() => {
    fetchData()
    fetchCategories()
  }, [queryString, filters, page, searchValueDebounce])

  const { isLoading, isFetching, data, error } = fetchDesignerInspirationQuery

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

  const handleChipsClick = (index: number) => {
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
    const val = selectedIds.join(',')
    setFilters(prev => (prev = val))

    setPosts([])
    setPage(1)
    setLoadedIds(new Set<any>())
  }, [selectedIds])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage) // Increment the page count
  }

  const breakpointColumns = {
    default: 6,
    2400: 5,
    1366: 4,
    1200: 3,
    500: 2,
  }

  return (
    <>
      {/* {blogValue !== 0 && <MainBlog blogValue={blogValue} />} */}
      {blogValue == 0 && (
        <Box>
          <Typography
            // className='brochure-title'
            sx={{
              color: customColors.darkBlueEbco,
              my: '0 !important',
              p: 4,
              fontSize: '40px',
              fontFamily: 'Uniform Bold',
              [theme.breakpoints.down('sm')]: {
                p: 2,
                fontSize: '28px',
              },
            }}
          >
            Designer&apos;s Inspirations
          </Typography>

          <Box
            sx={{
              marginBottom: totalPages <= 1 ? '3rem' : '',
              mt: 2,
              px: '64px',
              [theme.breakpoints.down('sm')]: {
                px: 2,
              },
            }}
          >
            {/* <Box className='search-filter-section row-space-between'>
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
            </Box> */}

            <Box
              className='views-filters row-space-between'
              sx={{
                mb: '1rem',
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
                        onClick={() => handleChipsClick(index)}
                      />
                    </ListItem>
                  )
                })}
              </Box>
            </Box>

            <Box>
              {/* {!isFetching && ( */}
              <Masonry
                breakpointCols={breakpointColumns}
                className='my-masonry-grid'
                columnClassName='my-masonry-grid_column'
              >
                {posts.map((item, index) => {
                  return (
                    <>
                      <DesignerCard item={item} key={index} />
                    </>
                  )
                })}
              </Masonry>
              {/* )} */}

              {(isLoading || isFetching) && <Loader />}

              {!isLoading && !isFetching && posts.length == 0 && (
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
                    No Data Found
                  </Typography>
                </Box>
              )}
            </Box>

            {/* {totalPages > 1 && (
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
            )} */}

            {totalPages > 1 && (
              <Box
                className='row-center'
                sx={{
                  margin: '3rem 0',
                }}
              >
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleLoadMore}
                  disabled={page >= totalPages}
                >
                  {page < totalPages ? 'Load More' : 'No More Items'}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  )
}

export default DesignerInspiration
