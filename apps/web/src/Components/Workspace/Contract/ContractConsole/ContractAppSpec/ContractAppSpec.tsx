import { ReactElement } from "react";
import "./ContractAppSpec.scss";
import ReactJson from "react-json-view";
import { Button } from "@mui/material";
import { downloadJson } from "@repo/utils";
import { A_ApplicationSpecParams } from "@repo/algocore";

export type ContractAppSpecProps = {
  appSpec: A_ApplicationSpecParams;
};

function ContractAppSpec({ appSpec }: ContractAppSpecProps): ReactElement {
  return (
    <div className="contract-app-spec-wrapper">
      <div className="contract-app-spec-container">
        <div className="app-spec-header">
          <div className="name">Application.json</div>
          <div>
            <Button
              color={"primary"}
              onClick={() => {
                downloadJson(
                  appSpec,
                  `${appSpec.contract.name}.application.json`,
                );
              }}
              variant={"outlined"}
              className="small-button"
              size={"small"}
            >
              Download
            </Button>
          </div>
        </div>
        <div className="app-spec-body">
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
