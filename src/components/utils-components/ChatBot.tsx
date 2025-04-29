"use client";
import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import React from "react";
import "./ChatBot.css";
import SalesIQ from "./SalesIQ";

const ChatBot = () => {

  const [openWidget, setOpenWidget] = React.useState<boolean>(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  React.useEffect(() => { }, []);
  const handleCustomChat = () => {
    //@ts-ignore
    if (typeof window !== "undefined" && window.$zoho && window.$zoho.salesiq) {
      //@ts-ignore
      window.$zoho.salesiq.floatwindow.visible("show");
    }
  };
  return (

    <>
    {
      isSmallScreen ?<>
       <div
      className={`widget-open row-space-between wide-padding`}

      style={{
        position: "fixed",
        top: "91%",
        left: "0%",
        height: '60px',
        zIndex: "110",
        backgroundColor: customColors.darkBlueEbco,
        cursor: "pointer",
      }}
      onClick={() => handleCustomChat()}
    >
     
      <Image
        src="/images/chat.svg"
        alt="chat image"
        width={50}
        height={50}
        className={`chat_icon`}
        style={{
          margin: " 0 0",
        }}
      />
     
      <SalesIQ
        widgetCode="siq9ffe6730e5453c353d513ecd7972fb359bdfed355d7f6246e2033239b00685ad"
        domain="https://salesiq.zoho.com/widget"
      />
     
    </div>
      </>:
    <div
      className={`widget-open row-space-between ${openWidget ? "wide-padding" : "normal-padding"
        }`}

      style={{
        position: "fixed",
        top: "85%",
        left: "0%",
        height: '60px',
        zIndex: "110",
        backgroundColor: customColors.darkBlueEbco,
        cursor: "pointer",
      }}
      // onClick={() => handleCustomChat()}
      onMouseEnter={() => {
        setOpenWidget(true);
        // handleCustomChat();
      }}
      onMouseLeave={() => setOpenWidget(false)}


    >
      {openWidget && (
        <Image
          src="/images/bumrah.webp"
          priority
          alt="Bumrah image"
          width={90}
          height={170}
          className="bumrah_image"
        />
      )}
      <Image
        src="/images/chat.svg"
        alt="chat image"
        width={50}
        height={50}
        className={`chat_icon`}
        style={{
          margin: " 0 0",
        }}
      />
      {openWidget && (
        <Box
          className="widget-title column-space-between"
          sx={{
            alignItems: "flex-start",
            // padding: "0 3rem 0 1rem"
          }}
          onClick={() => handleCustomChat()}
        >
          <Typography
            sx={{
              fontSize: "14px",
              color: customColors.whiteEbco,
              fontFamily: "Uniform Light",
            }}
          >
            HOW CAN WE
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              color: customColors.whiteEbco,
              fontFamily: "Uniform Medium",
            }}
          >
            HELP YOU
          </Typography>
        </Box>
      )}
      <SalesIQ
        widgetCode="siq9ffe6730e5453c353d513ecd7972fb359bdfed355d7f6246e2033239b00685ad"
        domain="https://salesiq.zoho.com/widget"
      />
      {/* {openWidget && (
                  <ClearIcon
                    className="close_icon"
                    onClick={() => setOpenWidget(false)}
                  />
                )} */}
    </div>
    }
    </>
  );
};

export default ChatBot;
