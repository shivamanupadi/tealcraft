import { HashRouter } from "react-router-dom";
import { ReactElement } from "react";
import { Button } from "@mui/material";

function AppRouter(): ReactElement {
  return (
    <div>
      <HashRouter>
        <div className="app-wrapper">
          <div className="app-container">hello world ! welcome</div>
          <Button variant={"contained"} color={"primary"}>
            click me
          </Button>
          <Button variant={"contained"} color={"secondary"}>
            click me
          </Button>
        </div>
      </HashRouter>
    </div>
  );
}

export default AppRouter;
