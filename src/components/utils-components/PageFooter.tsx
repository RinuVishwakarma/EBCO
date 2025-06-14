'use client'
import { customColors } from '@/styles/MuiThemeRegistry/theme'
import {
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import Image from 'next/image'
import classes from '@/styles/footer.module.css'
import { useEbcoWhiteButtonStyle } from '@/utils/CommonStyling'
import Link from 'next/link'
import './Footer.css'
import { useRouter } from 'next/navigation'
import Divider from './Divider'

export const Footer = () => {
  const whiteDarkBtnStyle = useEbcoWhiteButtonStyle()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down('md'),
  )
  const router = useRouter()
  return (
    <Box
      sx={{
        padding: isSmallScreen ? '1rem' : '1rem 2rem',
        backgroundColor: customColors.darkBlueEbco,
        color: '#ffffff',
        fontFamily: 'Uniform Medium',
        fontWeight: '400',
        width: '-webkit-fill-available',
        // position: "fixed",
        // bottom: 0,
      }}
      className='footer'
    >
      <Box>
        <Box
          className={
            isSmallScreen
              ? 'column-space-between footer-container'
              : 'row-space-around footer-container'
          }
          sx={{ padding: '1rem 0', alignItems: 'flex-start' }}
        >
          {/* <Box className="footer-link-nav" 
          > */}
          <Stack
            direction={'column'}
            key={isSmallScreen ? 'footerSmallScreen' : 'footerLargeScreen'}
            display={'flex'}
            className='footer-links-primary'
            sx={{
              gap: '10px',
            }}
          >
            <Link
              prefetch={false}
              className='footer_link footer-main-link'
              // onClick={() => router.push("/company")}
              href={'/company'}
            >
              About Us
            </Link>
            <Link
              prefetch={false}
              className='footer_link footer-main-link'
              // onClick={() => router.push("/news-and-events")}
              href={'/news-and-events'}
            >
              News & Events
            </Link>
            <Link
              prefetch={false}
              className='footer_link footer-main-link'
              // onClick={() => router.push("/discovery-centers")}
              href={'/discovery-centers'}
            >
              Discovery Centers
            </Link>
            <Link
              prefetch={false}
              className='footer_link footer-main-link'
              // onClick={() => router.push("/contact-us")}
              href={'/contact-us'}
            >
              Contact Us
            </Link>
          </Stack>
          <Box className='divider-footer mobile-partition-divider'></Box>
          <Box className='divider-footer mobile-partition'></Box>
          <Stack
            direction={'column'}
            display={'flex'}
            className='footer-links-secondary'
            sx={{
              gap: '10px',
            }}
          >
            <Link
              prefetch={false}
              className='footer_link'
              // onClick={() => {
              //   router.push("/returns-policy");
              // }}
              href={'/returns-policy'}
            >
              Returns Policy
            </Link>
            <Link
              prefetch={false}
              className='footer_link'
              // onClick={() => {
              //   router.push("/privacy-policy");
              // }}
              href={'/privacy-policy'}
            >
              Privacy Policy
            </Link>
            <Link
              prefetch={false}
              className='footer_link'
              // onClick={() => {
              //   router.push("/shipping-and-delivery");
              // }}
              href={'/shipping-and-delivery'}
            >
              Shipping & Delivery
            </Link>
            <Link
              prefetch={false}
              className='footer_link'
              // onClick={() => {
              //   router.push("/terms-of-use");
              // }}
              href={'/terms-of-use'}
            >
              Terms of Use
            </Link>
          </Stack>
          {/* </Box> */}
          <Box className='divider-footer'></Box>
          {/* <Box
            className={
              isSmallScreen
                ? "column-space-between footer-address"
                : "row-space-between footer-address"
            }
            flex={1}
            sx={{
              padding: isSmallScreen ? "2rem 1rem 1rem" : "0 1rem",
              alignItems: "flex-start",
            }}
          >
            <Stack
              direction={"column"}
              gap={0}
              className="address_footer"
              sx={{
                width: "100%",
              }}
            >
              <Typography className="footer_link" marginBottom={"1rem"} sx={{
                cursor: 'default !important'
              }}>
                402-3, Hyde Park, Saki Vihar Road,
                <br /> Opposite Ansa Industrial Estate,
                <br /> Chandivali,Andheri (East),
                <br />
                Mumbai - 400 072
              </Typography>
              <Typography className="footer_link" sx={{
                cursor: 'default !important'
              }}>
                CIN NO: U29299MH1973PTC016890
              </Typography>
            </Stack>
          </Box>
          <Box className="divider-footer"></Box> */}
          {/* <Box
            className={
              isSmallScreen
                ? "column-space-between footer-contact"
                : "row-space-between footer-contact"
            }
            flex={1}
            sx={{
              padding: isSmallScreen ? "2rem 1rem 1rem" : "0 1rem",
              alignItems: "flex-start",
              maxWidth: isSmallScreen ? "100%" : "60%",
            }}
          >
            <Stack
              direction={"column"}
              gap={2}
              className="row-space-between"
              sx={{
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Stack flex={1} className="contact-info">
                <div className="contact-item">
                  <span className="contact-title">General Queries:</span>
                  <span className="contact-detail">
                    +91-22-6783 7777 / +91-22-67837788
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-title">Service & Quality:</span>
                  <span className="contact-detail">1800 120 1122</span>
                </div>
                <div className="contact-item">
                  <span className="contact-title">General Enquiries:</span>
                  <span className="contact-detail" onClick={() => {
                    window.open('mailto:info@ebco.in')
                  }}
                    style={{
                      cursor: 'pointer',
                    }}>info@ebco.in</span>
                </div>
                <div className="contact-item">
                  <span className="contact-title">Service & Quality:</span>
                  <span className="contact-detail"
                    onClick={() => {
                      window.open('mailto:csc@ebco.in')
                    }}
                    style={{
                      cursor: 'pointer',
                    }}
                  >csc@ebco.in</span>
                </div>
              </Stack>
            </Stack>
          </Box> */}
          {/* <Box className="divider-footer"></Box> */}
          <Stack
            direction={'column'}
            gap={0}
            sx={{
              width: isSmallScreen ? '100%' : '20%',
            }}
            padding={isSmallScreen ? '2rem 1rem' : ''}
            className='certification-icons'
          >
            <Box
              className=' w-100 certification-footer'
              display={'flex'}
              flexDirection={'column'}
            >
              <Typography
                sx={{ marginBottom: '1rem !important' }}
                className='certi-footer-text'
              >
                Certifications :
              </Typography>
              <Stack
                direction={'row'}
                gap={2}
                alignItems={'center'}
                className='icons-footer-certi'
              >
                <Image
                  src='/images/ISO.svg'
                  alt='ISO CERTIFICATION VASAI UNIT-I'
                  width={67}
                  height={67}
                  title='ISO CERTIFICATION'
                  className='certificate'
                />
                <Image
                  src='/images/bifma.webp'
                  alt='BIFMA CERTIFICATION VASAI UNIT-I'
                  width={90}
                  height={25}
                  title='BIFMA CERTIFICATION'
                  className='certificate'
                />
                <Image
                  src='/images/bis.webp'
                  alt='BIS CERTIFICATION VASAI UNIT-I'
                  width={67}
                  height={67}
                  title='BIS CERTIFICATION'
                  className='certificate'
                />
                <Image
                  src='/images/certification/BIS_WT (2) - 240p.webp'
                  alt='BIS CERTIFICATION VASAI UNIT-I'
                  width={67}
                  height={67}
                  title='BIS CERTIFICATION'
                  className='certificate'
                />
              </Stack>
            </Box>
          </Stack>
          <Stack
            direction={'column'}
            gap={0}
            sx={{
              width: isSmallScreen ? '100%' : 'fit-content',
            }}
            padding={isSmallScreen ? '2rem 1rem' : ''}
            className='certification-icons'
          >
            <Typography
              sx={{ marginBottom: '1rem !important' }}
              className='certi-footer-text'
            >
              Connect with us :
            </Typography>
            <Stack
              direction={'row'}
              gap={3}
              sx={{
                alignSelf: 'flex-end',
                width: '100%',
                justifyContent: 'flex-start',
              }}
            >
              <Link
                prefetch={false}
                href='https://www.facebook.com/EbcoSolutions'
                target='_blank'
              >
                {' '}
                <Image
                  src='/images/Facebook.svg'
                  alt='Facebook icon'
                  width={!isSmallScreen ? '32' : '24'}
                  height={!isSmallScreen ? '32' : '24'}
                />{' '}
              </Link>
              <Link
                prefetch={false}
                href='https://twitter.com/ebcohardware'
                target='_blank'
              >
                {' '}
                <Image
                  src='/images/twitter.svg'
                  alt='Twitter icon'
                  width={!isSmallScreen ? '32' : '24'}
                  height={!isSmallScreen ? '32' : '24'}
                />{' '}
              </Link>
              <Link
                prefetch={false}
                href='https://www.linkedin.com/company/3866958?trk=mini-profile-title'
                target='_blank'
              >
                <Image
                  src='/images/linkedin.svg'
                  alt='LinkedIn icon'
                  width={!isSmallScreen ? '32' : '24'}
                  height={!isSmallScreen ? '32' : '24'}
                />{' '}
              </Link>
              <Link
                prefetch={false}
                href='https://www.instagram.com/ebcosolutions/'
                target='_blank'
              >
                <Image
                  src='/images/instagram.svg'
                  alt='Instagram icon'
                  width={!isSmallScreen ? '32' : '24'}
                  height={!isSmallScreen ? '32' : '24'}
                />{' '}
              </Link>
              <Link
                prefetch={false}
                href='https://www.youtube.com/channel/UCoSJ62LoWQkLbz27erlsgBw/videos'
                target='_blank'
              >
                <Image
                  src='/images/youtube.svg'
                  alt='Youtube icon'
                  width={!isSmallScreen ? '32' : '24'}
                  height={!isSmallScreen ? '32' : '24'}
                />{' '}
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
