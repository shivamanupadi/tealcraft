import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App/App";
import { ThemeProvider } from "@mui/material";
import { theme } from "@repo/theme";
import { ConfirmProvider } from "material-ui-confirm";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <ThemeProvider theme={theme}>
    <ConfirmProvider>
      <App></App>
    </ConfirmProvider>
  </ThemeProvider>,
);
