import { createTheme } from "@mui/material";

export const whiteColor = "#FFFFFF";
export const blackColor = "#000000";

export const lightGreyColor = "#f2f2f2";
export const darkGreyColor = "#666666";

export const primaryColor = "#9B95C9";
export const secondaryColor = "#82CA9C";
export const infoColor = "#00C0F3";
export const warningColor = "#FFE293";
export const errorColor = "#F69679";

export const primaryLightColor = "#E0DEF0";
export const secondaryLightColor = "#D8EDDD";
export const warningLightColor = "#FBBEA7";
export const errorLightColor = "#FABEA7";

export const theme = createTheme({
    shape: {
        borderRadius: 5,
    },
    palette: {
        primary: {
            main: primaryColor,
            contrastText: whiteColor,
        },
        secondary: {
            main: secondaryColor,
            contrastText: whiteColor,
        },
        info: {
            main: infoColor,
            contrastText: whiteColor,
        },
        warning: {
            main: warningColor,
            contrastText: whiteColor,
        },
        error: {
            main: errorColor,
            contrastText: whiteColor,
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
                    background: blackColor,
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
                        background: primaryLightColor,
                        color: blackColor,
                    },
                    "&.secondary-light-button": {
                        background: secondaryLightColor,
                        color: blackColor,
                    },
                    "&.error-light-button": {
                        background: errorLightColor,
                        color: blackColor,
                    },
                    "&.black-button": {
                        background: blackColor,
                        color: whiteColor,
                    },
                    "&.grey-button": {
                        background: lightGreyColor,
                        color: darkGreyColor,
                    },
                },
                outlined: {
                    "&.black-button": {
                        borderColor: blackColor,
                        color: blackColor,
                        background: whiteColor,
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
                        backgroundColor: primaryLightColor,
                        color: `#58595B`,
                    },
                    "&.secondary-light-alert": {
                        backgroundColor: secondaryLightColor,
                        color: `#58595B`,
                    },
                    "&.primary-light-alert-info": {
                        backgroundColor: primaryLightColor,
                        color: blackColor,
                    },
                    "&.warning-light-alert-info": {
                        backgroundColor: warningLightColor,
                        color: blackColor,
                    },
                },
            },
        },
    },
});
