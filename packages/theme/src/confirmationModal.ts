import { ModalGrowTransition } from "./modalTransitions";
import { GreyColors } from "./colors";

export const confirmationProps = {
  description: "",
  confirmationText: "Confirm",
  confirmationButtonProps: {
    color: "primary",
    variant: "contained",
    className: "black-button",
  },
  cancellationButtonProps: {
    color: "inherit",
    variant: "contained",
    className: "grey-button",
  },
  dialogProps: {
    maxWidth: "xs",
    className: "confirmation-modal",
    top: "100px",
    TransitionComponent: ModalGrowTransition,
    sx: {
      ".MuiDialogTitle-root": {
        color: GreyColors.GreyDark,
        textAlign: "center",
        marginTop: "10px",
      },
      ".MuiDialogContentText-root": {
        fontSize: "14px",
        color: GreyColors.GreyDark,
        textAlign: "center",
      },
    },
  },
  dialogActionsProps: {
    sx: {
      display: "block",
      marginTop: "10px",
      marginBottom: "30px",
      textAlign: "center",
    },
  },
};
