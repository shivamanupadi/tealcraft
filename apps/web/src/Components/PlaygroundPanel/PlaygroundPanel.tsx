import { ReactElement } from "react";
import "./PlaygroundPanel.scss";
import { Drawer } from "@mui/material";
import { Fragment } from "react";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import Playground from "../Playground/Playground";

interface PlaygroundPanelProps {
  appSpec: AppSpec;
  show: boolean;
  onClose: () => void;
}

function PlaygroundPanel({
  show,
  onClose,
  appSpec,
}: PlaygroundPanelProps): ReactElement {
  function handleClose() {
    onClose();
  }

  return (
    <div>
      <Fragment>
        <Drawer
          sx={{
            ".MuiDrawer-paper": {
              width: "50%",
              //background: GreyColors.F8F8F9,
            },
          }}
          ModalProps={{
            BackdropProps: {
              style: {
                //background: "transparent",
              },
            },
          }}
          anchor={"right"}
          open={show}
          onClose={handleClose}
        >
          <div className="playground-panel-wrapper">
            <div className="playground-panel-container">
              <div className="playground-panel-body">
                <Playground
                  appSpec={appSpec}
                  onClose={handleClose}
                ></Playground>
              </div>
            </div>
          </div>
        </Drawer>
      </Fragment>
    </div>
  );
}

export default PlaygroundPanel;
