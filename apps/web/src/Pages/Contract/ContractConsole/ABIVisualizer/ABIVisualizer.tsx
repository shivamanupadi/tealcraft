import "./ABIVisualizer.scss";
import { ReactElement, useState } from "react";
import { ABIContract, ABIContractParams } from "algosdk";
import ABIMethod from "./ABIMethod/ABIMethod";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";

type AbiVisualizerProps = {
  abi: ABIContractParams;
  appSpec: AppSpec;
};

function ABIVisualizer({
  abi = { methods: [], name: "" },
  appSpec,
}: AbiVisualizerProps): ReactElement {
  const abiInstance = new ABIContract(abi);
  const [isAbiJsonVisible, setAbiJsonVisibility] = useState<boolean>(false);
  return (
    <div className={"abi-visualizer-wrapper"}>
      <div className={"abi-visualizer-container"}>
        <div className={"abi-visualizer-body"}>
          <div className="abi">
            <div className="abi-header">
              <div>
                <div className="abi-name">Name : {abiInstance.name}</div>
                <div className="abi-desc">
                  Description:{" "}
                  {abiInstance.description
                    ? abiInstance.description
                    : "--Empty--"}
                </div>
              </div>
            </div>
            <div className="abi-body">
              <div className="abi-methods-container">
                <div className="abi-methods-header">
                  Methods ({abiInstance.methods.length})
                </div>
                <div className="abi-methods-body">
                  {abiInstance.methods.map((method, index) => {
                    return (
                      <div key={"abi-method-" + index}>
                        <ABIMethod
                          method={method.toJSON()}
                          appSpec={appSpec}
                        ></ABIMethod>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ABIVisualizer;
