'use client'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import './MyProfile.css'
import Profile from '@/components/utils-components/Profile'
import Orders from '@/components/utils-components/Order'
import Wishlist from '@/components/utils-components/Wishlist'
import ResetPassword from '@/components/utils-components/ResetPassword'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/reduxHooks'
import Bookmark from '@/components/utils-components/Bookmark'
import { setUrl } from '@/store/routeUrl'
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const MyProfile = () => {
  const [value, setValue] = useState<number>(0)
  const query = useSearchParams()
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const router = useRouter()
  const auth = useAppSelector(state => state.auth).isLoggedIn

  interface Tab {
    PROFILE: number
    ORDERS: number
    WISHLIST: number
    COLLECTION: number
    'RESET-PASSWORD': number
  }

  const tab: Tab = {
    PROFILE: 0,
    ORDERS: 1,
    WISHLIST: 2,
    COLLECTION: 3,
    'RESET-PASSWORD': 4,
  }

  const handleRoute = (key: keyof Tab) => {
    // router.push(`/my-profile?tab=${key}`);
    window.history.pushState(null, '', `?tab=${key.toLowerCase()}`)
  }
  const dispatch = useAppDispatch()

  useEffect(() => {
    let currentTab =
      tab[(query?.get('tab')?.toUpperCase() || '') as keyof Tab] || 0
    setValue(currentTab)
  }, [query])
  //console.log(window, "window")
  if (!auth) {
    const currentUrl = window.location.pathname + window.location.search
    const href = window.location.href
    //console.log(href);
    dispatch(
      setUrl({
        url: href,
      }),
    )
    localStorage.setItem('url', href)
    router.push('/login')
    return (
      <Box
        sx={{
          height: '90vh',
        }}
      ></Box>
    )
  } else {
    return (
      <Box className='myProfile-container'>
        <Box sx={{ width: '100%' }}>
          <Box
            className='myProfile-tabs'
            sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: '100vw' }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='basic tabs example'
              variant='scrollable'
              scrollButtons
              allowScrollButtonsMobile
              className='myProfile-scrollabletabs row-center'
            >
              <Tab
                sx={{
                  alignItems: 'center !important',
                }}
                className='row-center'
                label={
                  <Typography className='myProfile-tab-text'>
                    PROFILE
                  </Typography>
                }
                onClick={() => handleRoute('PROFILE')}
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  alignItems: 'center !important',
                }}
                className='row-center'
                label={
                  <Typography className='myProfile-tab-text'>ORDERS</Typography>
                }
                onClick={() => handleRoute('ORDERS')}
                {...a11yProps(1)}
              />
              <Tab
                className='row-center'
                sx={{
                  alignItems: 'center !important',
                }}
                label={
                  <Typography className='myProfile-tab-text'>
                    WISHLIST
                  </Typography>
                }
                onClick={() => handleRoute('WISHLIST')}
                {...a11yProps(2)}
              />
              <Tab
                className='row-center'
                sx={{
                  alignItems: 'center !important',
                }}
                label={
                  <Typography className='myProfile-tab-text'>
                    COLLECTION
                  </Typography>
                }
                onClick={() => handleRoute('COLLECTION')}
                {...a11yProps(3)}
              />
              <Tab
                sx={{
                  alignItems: 'center !important',
                }}
                className='row-center'
                onClick={() => handleRoute('RESET-PASSWORD')}
                label={
                  <Typography className='myProfile-tab-text'>
                    RESET PASSWORD
                  </Typography>
                }
                {...a11yProps(4)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Profile />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Orders />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Wishlist />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Bookmark />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <ResetPassword />
          </CustomTabPanel>
        </Box>
      </Box>
    )
  }
}

export default MyProfile
