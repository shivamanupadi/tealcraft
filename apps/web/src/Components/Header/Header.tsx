import { ReactElement } from "react";
import "./Header.scss";

import WorkspacePicker from "../WorkspacePicker/WorkspacePicker";

function Header(): ReactElement {
  return (
    <div className="header-wrapper">
      <div className="header-container">
        <div className="left-section">
          <div className="logo">TealCraft</div>
          <div className="greyed">/</div>
          <div className="greyed">Workspaces</div>
          <div>
            <WorkspacePicker></WorkspacePicker>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;