import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App/App";
import { ThemeProvider } from "@mui/material";
import { theme } from "@repo/theme";
import { ConfirmProvider } from "material-ui-confirm";
import { Provider } from "react-redux";
import { store } from "./Redux/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <ConfirmProvider>
        <App></App>
      </ConfirmProvider>
    </ThemeProvider>
  </Provider>,
);
