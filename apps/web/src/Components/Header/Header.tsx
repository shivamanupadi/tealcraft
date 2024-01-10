import { ReactElement } from "react";
import "./Header.scss";
import logo from "../../assets/images/logo.png";

import WorkspacePicker from "../WorkspacePicker/WorkspacePicker";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

function Header(): ReactElement {
  const { workspaces } = useSelector((state: RootState) => state.portal);
  return (
    <div className="header-wrapper">
      <div className="header-container">
        <div className="left-section">
          <div className="logo">
            <div>
              <img src={logo} alt="logo" />
            </div>

            <div>TealCraft</div>
          </div>
          <div className="greyed">/</div>
          <div className="greyed">Workspaces</div>
          {workspaces.length > 0 ? (
            <div>
              <WorkspacePicker></WorkspacePicker>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
