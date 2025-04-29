import React from "react";
import ErrorBoundary from "./ErrorBoundaries";
import { Stack, Typography } from "@mui/material";
import CustomPaper from "./CustomPaper";
// import NoDataAnimation from '../../public/lottie/error.json'


interface Props {
  children: React.ReactNode;
  size?: "sm" | "md";
  row?: boolean;
}
const ErrorBoundaryWrapper = ({ children, size, row }: Props) => {
  const animSize = size === "sm" ? "7rem" : size === "md" ? "14rem" : "30rem";
  const boxHeight = size === "sm" ? "7rem" : size === "md" ? "15rem" : "77vh";
  const textSize = size === "sm" ? "subtitle2" : size === "md" ? "h6" : "h4";
  return (
    <ErrorBoundary
      fallbackComponent={
        <CustomPaper>
          <Stack
            direction={row ? "row" : "column"}
            alignItems="center"
            justifyContent="center"
            height={boxHeight}
          >
            {/* <Lottie
              animationData={NoDataAnimation}
              open
              style={{ height: animSize }}
            /> */}
            <Typography variant={textSize} color="InfoText" align="center">
              Server Error, please try again later.
            </Typography>
          </Stack>
        </CustomPaper>
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
