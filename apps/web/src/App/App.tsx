import { ReactElement } from "react";
import "./App.scss";
import AppRouter from "./AppRouter";

function App(): ReactElement {
  return (
    <div className="app-root">
      <AppRouter></AppRouter>
    </div>
  );
}

export default App;
