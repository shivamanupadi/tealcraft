import { createTheme } from "@mui/material";

export enum ThemeColors {
  White = "#FFFFFF",
  Black = "#000000",
  LightGrey = "#f2f2f2",
  DarkGrey = "#666666",
  Primary = "#9B95C9",
  Secondary = "#82CA9C",
  Info = "#00C0F3",
  Warning = "#FFE293",
  Error = "#F69679",
  PrimaryLight = "#E0DEF0",
  SecondaryLight = "#D8EDDD",
  WarningLight = "#FBBEA7",
  ErrorLight = "#FABEA7",
}

export const theme = createTheme({
  shape: {
    borderRadius: 5,
  },
  palette: {
    primary: {
      main: ThemeColors.Primary,
      contrastText: ThemeColors.White,
    },
    secondary: {
      main: ThemeColors.Secondary,
      contrastText: ThemeColors.White,
    },
    info: {
      main: ThemeColors.Info,
      contrastText: ThemeColors.White,
    },
    warning: {
      main: ThemeColors.Warning,
      contrastText: ThemeColors.White,
    },
    error: {
      main: ThemeColors.Error,
      contrastText: ThemeColors.White,
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
          background: ThemeColors.Black,
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
            color: ThemeColors.Black,
          },
          "&.secondary-light-button": {
            background: ThemeColors.SecondaryLight,
            color: ThemeColors.Black,
          },
          "&.error-light-button": {
            background: ThemeColors.ErrorLight,
            color: ThemeColors.Black,
          },
          "&.black-button": {
            background: ThemeColors.Black,
            color: ThemeColors.White,
          },
          "&.grey-button": {
            background: ThemeColors.LightGrey,
            color: ThemeColors.DarkGrey,
          },
        },
        outlined: {
          "&.black-button": {
            borderColor: ThemeColors.Black,
            color: ThemeColors.Black,
            background: ThemeColors.White,
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
            color: ThemeColors.Black,
          },
          "&.warning-light-alert-info": {
            backgroundColor: ThemeColors.WarningLight,
            color: ThemeColors.Black,
          },
        },
      },
    },
  },
});
