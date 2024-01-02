import { ReactElement, useEffect } from "react";
import "./Portal.scss";
import Header from "./Header/Header";
import { useAppDispatch } from "../Redux/store";
import { initPortal } from "../Redux/portal/portalReducer";

function Portal(): ReactElement {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initPortal());
  }, []);

  return (
    <div className="portal-wrapper">
      <div className="portal-container">
        <Header></Header>
      </div>
    </div>
  );
}

export default Portal;
