// Try not to make layout.tsx as a client component
"use client";
import * as React from "react";
import { Poppins } from "next/font/google";
import NextAuthProvider from "@/context/NextAuthProvider";
import ReactQueryProvider from "@/context/ReactQueryProvider";
import ThemeRegistry from "@/styles/MuiThemeRegistry/ThemeRegistry";
import { ToastContainer } from "react-toastify";

import { Header } from "@/components/utils-components/PageHeader";
import { Footer } from "@/components/utils-components/PageFooter";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Box } from "@mui/material";
import { useAppSelector } from "@/store/reduxHooks";
import BottomDrawer from "./BottomDrawer";

export default function CommonRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Provider store={store}>
            <ThemeRegistry>
              <div
                style={{
                  position: "relative",
                }}
              >
                <Header />
                {children}
                <Footer />
              </div>
            </ThemeRegistry>
          </Provider>
        </ReactQueryProvider>

        <ToastContainer />
      </body>
    </html>
  );
}
