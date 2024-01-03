import { ReactElement, useEffect } from "react";
import "./App.scss";
import AppRouter from "./AppRouter";
import { useAppDispatch } from "../Redux/store";
import { initApp } from "../Redux/app/appReducer";

function App(): ReactElement {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initApp());
  }, []);

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
