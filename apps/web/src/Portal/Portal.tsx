import { ReactElement } from "react";
import "./Portal.scss";
import Header from "./Header/Header";

function Portal(): ReactElement {
  return (
    <div className="portal-wrapper">
      <div className="portal-container">
        <Header></Header>
      </div>
    </div>
  );
}

export default Portal;
