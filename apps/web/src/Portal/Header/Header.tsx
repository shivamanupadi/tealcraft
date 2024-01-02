import { ReactElement, useState } from "react";
import "./Header.scss";
import { Button, Menu, MenuItem } from "@mui/material";
import { UnfoldMore } from "@mui/icons-material";

function Header(): ReactElement {
  const [workspaceAnchorEl, setWorkspaceAnchorEl] =
    useState<null | HTMLElement>(null);

  return (
    <div className="header-wrapper">
      <div className="header-container">
        <div className="left-section">
          <div className="logo">TealCraft</div>
          <div className="greyed">/</div>
          <div className="greyed">Workspaces</div>
          <div style={{ marginTop: -5 }}>
            <Button
              color={"primary"}
              variant={"contained"}
              className="grey-button"
              size={"small"}
              endIcon={<UnfoldMore />}
              onClick={(ev) => {
                setWorkspaceAnchorEl(ev.currentTarget);
              }}
            >
              Select workspace
            </Button>
          </div>
        </div>

        <Menu
          anchorEl={workspaceAnchorEl}
          sx={{
            ".MuiPaper-root": {
              boxShadow:
                "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%) !important",
            },
          }}
          open={Boolean(workspaceAnchorEl)}
          disableAutoFocusItem={true}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onClose={() => {
            setWorkspaceAnchorEl(null);
          }}
        >
          <MenuItem
            sx={{ marginTop: "10px", "&:hover": { background: "none" } }}
            selected={false}
          >
            <Button
              color={"primary"}
              variant={"contained"}
              size={"small"}
              onClick={() => {
                setWorkspaceAnchorEl(null);
              }}
            >
              Create workspace
            </Button>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default Header;
