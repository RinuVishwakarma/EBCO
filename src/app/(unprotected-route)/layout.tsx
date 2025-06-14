import * as React from 'react'
import './layout.css'
import '../../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import ThemeRegistry from '@/styles/MuiThemeRegistry/ThemeRegistry'
import { Header } from '@/components/utils-components/PageHeader'
import { Footer } from '@/components/utils-components/PageFooter'
import ChatBot from '@/components/utils-components/ChatBot'
import GoogleAnalytics from '../../components/utils-components/GoogleAnalytics'
import ReduxProvider from '@/context/ReduxProvider'
import ReactQueryProvider from '@/context/ReactQueryProvider'
import GoogleMapProvider from '@/context/GoogleProvider'

export const metadata = {
  title: 'Ebco - Furniture Fittings and Accessories',
  description:
    "Ebco's product range spans Drawer Slides, Hinges, Computer Furniture Fittings, Joinery Fittings, Wardrobe Fittings, Furniture Locks, Kitchen Systems and Accessories, Window and Door Fittings, Architectural Fittings, LED Lights and more.",
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        <meta name='format-detection' content='telephone=no' />
        <GoogleAnalytics />
      </head>

      <body>
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-KS39JPG'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-NR2ZGJWH'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <ReactQueryProvider>
          <ThemeRegistry>
            <ReduxProvider>
              <GoogleMapProvider>
                <Header />
                <ChatBot />
                <div
                  className='main'
                  style={{
                    minHeight: '80vh',
                  }}
                >
                  {children}
                </div>
                <Footer />
              </GoogleMapProvider>
            </ReduxProvider>
          </ThemeRegistry>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
