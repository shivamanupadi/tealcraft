import { ReactElement } from "react";
import "./ContractAppSpec.scss";
import ReactJson from "react-json-view";

export type ContractAppSpecProps = {
  appSpec: any;
};

function ContractAppSpec({ appSpec }: ContractAppSpecProps): ReactElement {
  return (
    <div className="contract-app-spec-wrapper">
      <div className="contract-app-spec-container">
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
