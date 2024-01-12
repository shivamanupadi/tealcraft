import { ReactElement, useState } from "react";
import "./Header.scss";
import logo from "../../assets/images/logo.png";
import UserSettings from "./Settings/UserSettings";

import WorkspacePicker from "../WorkspacePicker/WorkspacePicker";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Settings } from "@mui/icons-material";

function Header(): ReactElement {
  const { workspaces } = useSelector((state: RootState) => state.portal);
  const [isSettingsVisible, setSettingsVisibility] = useState<boolean>(false);
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
        <div className="right-section">
          <div className="actions">
            <div>
              <Settings
                className="hover"
                onClick={() => {
                  setSettingsVisibility(true);
                }}
              ></Settings>
              {isSettingsVisible ? (
                <UserSettings
                  show={isSettingsVisible}
                  onClose={() => {
                    setSettingsVisibility(false);
                  }}
                ></UserSettings>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
