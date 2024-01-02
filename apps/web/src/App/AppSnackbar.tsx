import { useDispatch, useSelector } from "react-redux";
import { Alert, Snackbar } from "@mui/material";
import { hideSnack } from "../Redux/app/snackbarReducer";
import { RootState } from "../Redux/store";
import { ReactElement } from "react";

const getExtraClass = (severity: string): string => {
  if (severity === "success") return "success-snack-bar";
  if (severity === "error") return "error-snack-bar";

  return "";
};

function AppSnackbar(): ReactElement {
  const dispatch = useDispatch();

  const snackbar = useSelector((state: RootState) => state.snackbar);
  const { show, severity, duration, message } = snackbar;

  const extraClass = getExtraClass(severity);

  const handleClose = () => {
    dispatch(hideSnack());
  };

  return (
    <Snackbar
      open={show}
      autoHideDuration={duration}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={handleClose}
    >
      <Alert
        icon={false}
        className={`chip ${extraClass}`}
        severity={severity}
        onClose={handleClose}
      >
        <span>{message}</span>
      </Alert>
    </Snackbar>
  );
}

export default AppSnackbar;
