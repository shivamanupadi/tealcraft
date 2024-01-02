import { ReactElement } from "react";
import "./App.scss";
import AppRouter from "./AppRouter";

function App(): ReactElement {
  return (
    <div className="app-root">
      <div className="app-wrapper">
        <div className="app-container">
          <AppRouter></AppRouter>
        </div>
      </div>
    </div>
  );
}

export default App;
