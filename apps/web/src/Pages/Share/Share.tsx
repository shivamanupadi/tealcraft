import { ReactElement } from "react";
import "./Share.scss";
import { Outlet } from "react-router-dom";
import logo from "../../assets/images/full-logo.png";

function Share(): ReactElement {
  return (
    <div className="share-wrapper">
      <div className="share-container">
        <div className="share-header">
          <div className="logo">
            <div>
              <img src={logo} alt="logo" />
            </div>
            <div>
              <span className="share">| Share</span>
            </div>
          </div>
        </div>
        <div className="share-body">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default Share;
