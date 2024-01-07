import { ReactElement } from "react";
import "./ContractConsole.scss";

function ContractConsole(): ReactElement {
  return (
    <div className="contract-console-wrapper">
      <div className="contract-console-container">
        <div className="contract-console-header">Console</div>
        <div className="contract-console-body"></div>
      </div>
    </div>
  );
}

export default ContractConsole;
