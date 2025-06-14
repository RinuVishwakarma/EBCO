import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material";
import { customColors } from "@/styles/MuiThemeRegistry/theme";

export const useCommonInputStyle = () => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("xl"));

  return {
    width: "100%",
    padding: "0.5rem",
    fontFamily: "Uniform Medium",
    fontSize: isMediumScreen ? "0.8rem" : isLargeScreen ? "1rem" : "1rem",
    color: theme.palette.text.secondary,
    border: "1px solid #E5E7EB",
    borderRadius: "2px",
    height: "45px",
  };
};
export const useEbcoDarkBlueButtonStyle = () => {
  const theme = useTheme();

  return {
    width: "100%",
    height: "45px",
    backgroundColor: theme.palette.primary.main,
    color: "#ffffff",
    fontFamily: "Uniform Medium",
    fontSize: "1rem",
    border: "none",
    borderRadius: "100px",
    fontWeight: "200 !important",
    cursor: "pointer",
  };
};

export const useEbcoOrangeButtonStyle = () => {
  const theme = useTheme();

  return {
    width: "100%",
    height: "45px",
    backgroundColor: customColors.orangeEbco,
    color: "#ffffff",
    fontFamily: "Uniform Medium",
    fontSize: "1rem",
    border: "none",
    borderRadius: "100px",
    fontWeight: "200 !important",
    cursor: "pointer",
  };
};

export const useEbcoWhiteButtonStyle = () => {
  const theme = useTheme();

  return {
    width: "auto",
    height: "auto",
    backgroundColor: "#ffffff",
    color: customColors.darkBlueEbco,
    fontFamily: "Uniform Bold",
    fontSize: "0.8rem",
    border: "none",
    borderRadius: "100px",
    fontWeight: "200 !important",
    cursor: "pointer",
    padding: " 0.5rem 1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
};

export const useEbcoBorderBlueButtonStyle = () => {
  const theme = useTheme();

  return {
    width: "100%",
    height: "45px",
    border: ` 1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    fontFamily: "Uniform Medium",
    fontSize: "1rem",
    borderRadius: "100px",
    fontWeight: "200 !important",
    cursor: "pointer",
    backgroundColor: "#fff",
  };
};

export const blackBorderButtonStyle = {
  width: "100%",
  height: "60px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid #bebebe",
  borderRadius: "4px",
  margin: "2rem 0",
  cursor: "pointer",
  padding: "0.5rem",
};

export const useInputLabelStyle = () => {
  const theme = useTheme();

  return {
    fontFamily: "Uniform Medium",
    fontSize: "1rem",
    color: theme.palette.text.secondary,
    marginBottom: "8px",
  };
};

export const inputError = {
  color: "red",
  fontFamily: "Uniform Medium !important",
  fontSize: "0.8rem",
  margin: "0.2rem 0",
};

export const useLinkStyle = () => {
  const theme = useTheme();

  return {
    color: "inherit",
    textDecoration: "none",
  };
};

export const useOtpInput = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  return {
    width: isSmallScreen ? "2.5rem" : "3rem",
    height: isSmallScreen ? "2.5rem" : "3rem",
    padding: "0.25rem",
    margin: "0 0.25rem",
    borderRadius: "4px",
    border: ` 1px solid ${customColors.orangeEbco}`,
    boxShadow: ` -2px 5px 8px -5px ${customColors.orangeEbco} `,
    fontSize: "18px",
    fontFamily: "Uniform Medium",
    color: customColors.darkgrey,
  };
};

export const useWhiteParagraphStyle = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  return {
    fontSize: isSmallScreen ? "12px" : "14px",
    color: "#ffffff",
    fontFamily: "Uniform Light",
    fontWeight: "200",
    wordBreak: "break-all",
  };
};

export const useLightTextSubHeading = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  return {
    fontSize: isSmallScreen ? "24px" : "28px",
    color: customColors.darkBlueEbco,
    fontFamily: "Uniform Light",
  };
};
export const useLightTextHeading = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );
  const isMediumScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("md")
  );
  return {
    fontSize: isSmallScreen ? "20px" : isMediumScreen ? "24px" : "40px",
    color: customColors.darkBlueEbco,
    fontFamily: "Uniform Light",
  };
};

export const useBoldTextSubHeading = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  return {
    fontSize: isSmallScreen ? "24px" : "28px",
    color: customColors.darkBlueEbco,
    fontFamily: "Uniform Bold",
  };
};
export const useBoldTextHeading = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("sm")
  );
  const isMediumScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.down("md")
  );
  return {
    fontSize: isSmallScreen ? "20px" : isMediumScreen ? "24px" : "40px",
    color: customColors.darkBlueEbco,
    fontFamily: "Uniform Bold",
  };
};
