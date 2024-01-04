import { ReactElement } from "react";
import "./ContractEditor.scss";
import { RootState } from "../../../../Redux/store";
import { useSelector } from "react-redux";

function ContractEditor(): ReactElement {
  const { contract } = useSelector((state: RootState) => state.contract);

  return (
    <div className="contract-editor-wrapper">
      <div className="contract-editor-container">{contract?.name}</div>
    </div>
  );
}

export default ContractEditor;
