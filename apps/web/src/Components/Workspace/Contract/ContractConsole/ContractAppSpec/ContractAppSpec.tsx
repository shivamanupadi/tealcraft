import { ReactElement } from "react";
import "./ContractAppSpec.scss";
import ReactJson from "react-json-view";
import { Button } from "@mui/material";
import { downloadJson } from "@repo/utils";

export type ContractAppSpecProps = {
  appSpec: any;
};

function ContractAppSpec({ appSpec }: ContractAppSpecProps): ReactElement {
  return (
    <div className="contract-app-spec-wrapper">
      <div className="contract-app-spec-container">
        <div className="spec-actions">
          <Button
            color={"primary"}
            onClick={() => {
              downloadJson(appSpec, "application.json");
            }}
            variant={"contained"}
            className="small-button"
            size={"small"}
          >
            Download
          </Button>
        </div>
        <div className="app-spec">
          <ReactJson
            src={appSpec}
            name={false}
            displayObjectSize={false}
            displayDataTypes={false}
            enableClipboard={false}
            iconStyle={"square"}
            collapsed={1}
          />
        </div>
      </div>
    </div>
  );
}

export default ContractAppSpec;
