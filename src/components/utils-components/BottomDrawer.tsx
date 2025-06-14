import React, { FC, ReactNode } from "react";
import { Box, Paper, PaperProps } from "@mui/material";
import { useAppSelector } from "@/store/reduxHooks";

const BottomDrawer = () => {
  const drawer = useAppSelector((state) => state.drawer)?.isOpen;
  //console.log(drawer)
  return (
    <>
      {drawer && (
        <>
          <Box
            sx={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(5px)",
              overflow: "hidden",
            }}
            onClick={() => {
              //console.log('clicked')
            }}
          ></Box>

          <Box
            sx={{
              position: "absolute", // Keeps the div positioned absolutely
              top: "60%", // Start the div from the middle of the viewport
              left: "0", // Align the div to the left side of the viewport
              width: "100%", // The div spans the full width of the viewport
              height: "40vh", // The div occupies half of the viewport height
              backgroundColor: "#ffffff", // White background color
              borderTopRightRadius: "50px",
              borderTopLeftRadius: "50px",
              zIndex: "100",
            }}
          >
            {/* Content of the div */}
          </Box>
        </>
      )}
    </>
  );
};

export default BottomDrawer;
