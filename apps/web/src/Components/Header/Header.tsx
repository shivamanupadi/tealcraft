import { ReactElement, useState } from "react";
import "./Header.scss";
import logo from "../../assets/images/logo.png";
import UserSettings from "../Settings/UserSettings";

import WorkspacePicker from "../WorkspacePicker/WorkspacePicker";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Button } from "@mui/material";
import { SettingsOutlined } from "@mui/icons-material";

function Header(): ReactElement {
  const { workspaces } = useSelector((state: RootState) => state.portal);
  const [isSettingsVisible, setSettingsVisibility] = useState<boolean>(false);
  return (
    <div className="header-wrapper">
      <div className="header-container">
        <div className="left-section">
          <div className="logo">
            <div className="logo-container">
              <div>
                <img src={logo} alt="logo" />
              </div>

              <div>TealCraft</div>
            </div>
          </div>

          {workspaces.length > 0 ? (
            <div className="workspaces-title">
              Workspaces&nbsp;&nbsp;/&nbsp;&nbsp;
            </div>
          ) : (
            ""
          )}
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
              <Button
                startIcon={<SettingsOutlined></SettingsOutlined>}
                size={"small"}
                onClick={() => {
                  setSettingsVisibility(true);
                }}
                variant="contained"
                color={"primary"}
                className="grey-button"
              >
                Settings
              </Button>

              <UserSettings
                show={isSettingsVisible}
                onClose={() => {
                  setSettingsVisibility(false);
                }}
              ></UserSettings>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
