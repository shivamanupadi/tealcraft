import { createTheme, styled, InputBase, InputBaseProps } from "@mui/material";
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
          "&.small-button": {
            padding: "0px 5px",
            ".MuiButton-startIcon": {
              margin: "0px",
            },
          },
        },
        contained: {
          "&.primary-light-button": {
            background: ThemeColors.PrimaryLight,
            color: BaseColors.Black,
          },
          "&.secondary-light-button": {
            background: ThemeColors.SecondaryLight,
            color: GreyColors.A7A9AC,
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
            background: GreyColors.F8F8F9,
            color: GreyColors.FormLabel,
          },
          "&.white-background-button": {
            background: BaseColors.White,
          },
        },
        outlined: {
          "&.black-button": {
            borderColor: BaseColors.Black,
            color: BaseColors.Black,
            background: BaseColors.White,
          },
          "&.secondary-light-button": {
            borderColor: ThemeColors.SecondaryLight,
            color: GreyColors.A7A9AC,
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
          "&.micro-alert": {
            padding: "0px 8px",
            borderRadius: "3px",
            display: "inline-block",
            fontSize: "12px",
            fontWeight: "bold",
            textAlign: "center",
            ".MuiAlert-message": {
              padding: "3px 0",
            },
          },
          "&.primary-light-alert": {
            backgroundColor: ThemeColors.PrimaryLight,
            color: `#58595B`,
          },
          "&.secondary-light-alert": {
            backgroundColor: ThemeColors.SecondaryLight,
            color: `#58595B`,
          },
          "&.success-snack-bar": {
            backgroundColor: ThemeColors.PrimaryLight,
            color: BaseColors.Black,
          },
          "&.error-snack-bar": {
            backgroundColor: ThemeColors.WarningLight,
            color: BaseColors.Black,
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          "&.classic-modal": {
            ".MuiDialogTitle-root": {
              color: GreyColors.FormLabel,
              fontSize: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "middle",
              ".close-modal": {
                "&:hover": {
                  cursor: "pointer",
                },
              },
            },
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          "&.classic-label": {
            fontSize: "14px",
            color: GreyColors.FormLabel,
          },
          "&.classic-value": {
            fontSize: "15px",
            fontWeight: "bold",
            color: GreyColors.FormValue,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiButtonBase-root": {
            color: GreyColors.A7A9AC,
          },
          "& .MuiButtonBase-root.Mui-selected": {},
        },
      },
    },
  },
});

export const ShadedInput = styled(InputBase)<InputBaseProps>(() => {
  return {
    padding: 5,
    paddingLeft: 10,
    marginTop: 5,
    border: "none",
    fontSize: "14px",
    background: GreyColors.F8F8F9,
    borderRadius: 5,
    color: GreyColors.A7A9AC,
  };
});
