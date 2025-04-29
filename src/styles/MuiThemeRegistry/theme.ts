"use client";
import { createTheme } from "@mui/material/styles";
import CustomDataGrid from "./overrides/customDataGrid";
import { useWhiteParagraphStyle } from "@/utils/CommonStyling";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#CCE7F9",
      dark: "#092853",
      contrastText: "#ffffff",
      main: "#092853",
    },
    secondary: {
      main: "#E87B1E",
      dark: "#E87B1E",
      light: "#FFF3EB",
    },
    text: {
      primary: "#000000",
      secondary: "#1B1B1B",
      disabled: "#8D8D8D",
    },
    background: {
      default: "#FEFEFE",
    },
  },
  typography: {
    fontFamily: "Uniform Medium",
  },

  breakpoints: {
    values: {
      xs: 380,
      sm: 450,
      md: 960,
      lg: 1300,
      xl: 1600,
    },
  },
});

theme = createTheme(theme, {
  components: { ...CustomDataGrid(theme) },
});

export default theme;

export const customColors = {
  greyEbco: "#5B5B5B",
  orangeEbco: "#E87B1E",
  darkgrey: "#252525",
  lightBlueEbco: "#3AB2FE",
  darkBlueEbco: "#092853",
  lightGreyEbco: "#8D8D8D",
  divider: "#8D8D8D74",
  footerLightBlueEbco: "#E7F5FF",
  ebcoBorder: "rgba(9, 40, 83, 0.2)",
  blueEbcoText: "#092853",
  whiteEbco: "#FFFFFF",
  opaqueBlue: "#03247D99",
  skyBlueEbco: "#eaf0f5",
  buleHeaderEbcoo: "#092853E5",
  whiteHeaderEbco: "#fffffff7",
  menuBorderLight: "#CCE7F95E",
  menuBorderDark: "#d8dde1e3",
  inputLabel: "#5C5C5C",
  selectBox: "#E5E7EB",
  lightBlue: "#EAF0F5",
  lightSkyBlue: "#F7F9FC",
};
