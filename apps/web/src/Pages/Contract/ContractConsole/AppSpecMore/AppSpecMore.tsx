import { ReactElement } from "react";
import "./AppSpecMore.scss";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import ContractClient from "../ContractClient/ContractClient";
import BareCallConfig from "../BareCallConfig/BareCallConfig";

export type ContractAppSpecProps = {
  appSpec: AppSpec;
};

function AppSpecMore({ appSpec }: ContractAppSpecProps): ReactElement {
  return (
    <div className="app-spec-more-wrapper">
      <div className="app-spec-more-container">
        <div className="app-spec-more-body">
          <ContractClient appSpec={appSpec}></ContractClient>
          <BareCallConfig appSpec={appSpec}></BareCallConfig>
        </div>
      </div>
    </div>
  );
}

export default AppSpecMore;
