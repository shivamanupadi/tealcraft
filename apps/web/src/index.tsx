import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App/App";
import { ThemeProvider } from "@mui/material";
import { theme } from "@repo/theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <ThemeProvider theme={theme}>
    <App></App>
  </ThemeProvider>,
);
