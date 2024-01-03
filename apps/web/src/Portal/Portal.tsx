import { ReactElement, useEffect } from "react";
import "./Portal.scss";
import Header from "./Header/Header";
import { useAppDispatch } from "../Redux/store";
import { initPortal } from "../Redux/portal/portalReducer";
import { Outlet } from "react-router-dom";

function Portal(): ReactElement {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initPortal());
  }, []);

  return (
    <div className="portal-wrapper">
      <div className="portal-container">
        <Header></Header>
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default Portal;
