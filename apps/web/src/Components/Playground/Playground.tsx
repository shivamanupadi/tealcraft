import "./Playground.scss";
import { ReactElement } from "react";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";

import { Close } from "@mui/icons-material";
import AccountPicker from "../AccountPicker/AccountPicker";
import NodePicker from "../NodePicker/NodePicker";

interface PlaygroundProps {
  appSpec: AppSpec;
  onClose: () => void;
}

export function Playground({
  appSpec,
  onClose,
}: PlaygroundProps): ReactElement {
  return (
    <div className={"playground-wrapper"}>
      <div className={"playground-container"}>
        <div className="playground-header">
          <div className="title">Playground</div>
          <div className="actions">
            <div>
              <AccountPicker></AccountPicker>
            </div>
            <div>
              <NodePicker></NodePicker>
            </div>
            <div>
              <Close className="close hover" onClick={onClose}></Close>
            </div>
          </div>
        </div>
        <div className="playground-body"></div>
      </div>
    </div>
  );
}

export default Playground;
