import "./AbiVisualizer.scss";
import { ReactElement } from "react";
import { ABIContract, ABIContractParams } from "algosdk";
import { downloadJson } from "@repo/utils";
import { Button } from "@mui/material";

type AbiVisualizerProps = {
  abi: ABIContractParams;
};

function AbiVisualizer({
  abi = { methods: [], name: "" },
}: AbiVisualizerProps): ReactElement {
  const abiInstance = new ABIContract(abi);
  return (
    <div className={"abi-visualizer-wrapper"}>
      <div className={"abi-visualizer-container"}>
        <div className={"abi-visualizer-body"}>
          <div className="abi">
            <div className="abi-header">
              <div>
                <div className="abi-name">Name: {abiInstance.name}</div>
                <div className="abi-desc">
                  Description:{" "}
                  {abiInstance.description
                    ? abiInstance.description
                    : "--Empty--"}
                </div>
              </div>
              <div>
                <Button
                  color={"primary"}
                  onClick={() => {
                    downloadJson(abiInstance.toJSON(), "abi.json");
                  }}
                  variant={"outlined"}
                  className="small-button"
                  size={"small"}
                >
                  Download
                </Button>
              </div>
            </div>
            <div className="abi-body">
              <div className="abi-methods-container">
                <div className="abi-methods-header">
                  Methods ({abiInstance.methods.length})
                </div>
                <div className="abi-methods-body">
                  {abiInstance.methods.map((method, index) => {
                    return <div key={"abi-method-" + index}>{method.name}</div>;
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

export default AbiVisualizer;
