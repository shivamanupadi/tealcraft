import { createTheme } from "@mui/material";
import { BaseColors, GreyColors, ThemeColors } from "./colors";

export const theme = createTheme({
  shape: {
    borderRadius: 5,
  },
  palette: {
    primary: {
      main: ThemeColors.Primary,
      contrastText: BaseColors.White,
    },
    secondary: {
      main: ThemeColors.Secondary,
      contrastText: BaseColors.White,
    },
    info: {
      main: ThemeColors.Info,
      contrastText: BaseColors.White,
    },
    warning: {
      main: ThemeColors.Warning,
      contrastText: BaseColors.White,
    },
    error: {
      main: ThemeColors.Error,
      contrastText: BaseColors.White,
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: BaseColors.Black,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          ":hover": {
            boxShadow: "none",
          },
        },
        contained: {
          "&.primary-light-button": {
            background: ThemeColors.PrimaryLight,
            color: BaseColors.Black,
          },
          "&.secondary-light-button": {
            background: ThemeColors.SecondaryLight,
            color: BaseColors.Black,
          },
          "&.error-light-button": {
            background: ThemeColors.ErrorLight,
            color: BaseColors.Black,
          },
          "&.black-button": {
            background: BaseColors.Black,
            color: BaseColors.White,
          },
          "&.grey-button": {
            background: GreyColors.GreyLight,
            color: GreyColors.GreyDark,
          },
        },
        outlined: {
          "&.black-button": {
            borderColor: BaseColors.Black,
            color: BaseColors.Black,
            background: BaseColors.White,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          "&.mini-alert": {
            padding: "0px 10px",
            borderRadius: "5px",
            display: "inline-block",
            fontSize: "12px",
            fontWeight: "bold",
            textAlign: "center",
            ".MuiAlert-message": {},
          },
          "&.primary-light-alert": {
            backgroundColor: ThemeColors.PrimaryLight,
            color: `#58595B`,
          },
          "&.secondary-light-alert": {
            backgroundColor: ThemeColors.SecondaryLight,
            color: `#58595B`,
          },
          "&.primary-light-alert-info": {
            backgroundColor: ThemeColors.PrimaryLight,
            color: BaseColors.Black,
          },
          "&.warning-light-alert-info": {
            backgroundColor: ThemeColors.WarningLight,
            color: BaseColors.Black,
          },
        },
      },
    },
  },
});
