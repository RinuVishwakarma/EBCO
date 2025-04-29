"use client";
import BoxShadowWrapper from "@/components/utils-components/BoxShadowWrapper";
import { Box, colors, Input, Typography, useMediaQuery } from "@mui/material";
import Image from "next/image";
import EbcoLogo from "@/assets/ebcoDarkLogo.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { SignUp } from "@/interface/SignUp";
import { useTheme } from "@mui/material";
import {
  blackBorderButtonStyle,
  inputError,
  useCommonInputStyle,
  useEbcoDarkBlueButtonStyle,
  useInputLabelStyle,
  useEbcoBorderBlueButtonStyle,
} from "@/utils/CommonStyling";
import { useRouter } from "next/navigation";

interface ForgotPasswordProps {
  email: string;
  setEmailSent: (sent: boolean) => void;
}

const ForgotPassword = ({ email, setEmailSent }: ForgotPasswordProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUp>();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const commonInputStyle = useCommonInputStyle();
  const ebcoBlueBorderButton = useEbcoBorderBlueButtonStyle();
  const ebcoDarkButton = useEbcoDarkBlueButtonStyle();
  const router = useRouter();
  const onSubmit: SubmitHandler<SignUp> = (data) => {
    //console.log(data)
  };
  return (
    <Box
      className="column-center"
      sx={{
        width: "100%",
        padding: isSmallScreen ? "0" : "0 2rem",
        height: isSmallScreen ? "100%" : "70vh",
      }}
      gap={2}
    >
      <BoxShadowWrapper
        sx={{
          width: "100%",
          flex: 1,
          height: "80%",
          position: "relative",
          justifyContent: "space-evenly",
        }}
        className="column-center"
      >
        <Image
          src={EbcoLogo}
          width={100}
          height={74}
          alt="ebco logo"
          style={{
            position: isMediumScreen ? "absolute" : "relative",
            top: "1rem",
          }}
        />

        <Box
          className="column-center"
          sx={{
            margin: isSmallScreen ? "4rem 0" : "0",
          }}
        >
          <Typography
            variant="h5"
            style={{
              fontFamily: "Uniform Bold",
              margin: "2rem 0",
              color: theme.palette.primary.dark,
              textAlign: "center",
            }}
          >
            Verify Your Email
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.disabled,
              fontSize: "16px",
              textAlign: "center",
              width: "100%",
            }}
          >
            Account activation link sent to your email address Please follow the
            link inside to continue.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.disabled,
              fontSize: "16px",
              textAlign: "center",
              width: "100%",
              marginTop: "1rem",
              cursor: "pointer",
            }}
            onClick={() => setEmailSent(false)}
          >
            Didn&apos;t get the mail?{" "}
            <span style={{ color: "#9155FD" }}>Resend</span>{" "}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: isSmallScreen ? "95%" : "80%",
          }}
        >
          <button style={ebcoDarkButton} onClick={() => router.push("/login")}>
            Back to login
          </button>
        </Box>
      </BoxShadowWrapper>
    </Box>
  );
};

export default ForgotPassword;
