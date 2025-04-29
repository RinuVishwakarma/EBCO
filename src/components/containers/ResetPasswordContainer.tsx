import { Box } from "@mui/material";
import ResetPassword from "../module-components/Reset-Password/ResetPassword";
import { Suspense } from "react";

const ResetPasswordContainer = () => {
  return (
    <Box

      className="row-center login-non-image-container"
    >
      <Suspense
        fallback={
          <div
            className="new-arrival-loader"
            style={{
              height: "80vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></div>
        }
      >
        <ResetPassword />
      </Suspense>
    </Box>
  );
};

export default ResetPasswordContainer;
