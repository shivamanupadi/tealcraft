import { ReactElement, useEffect } from "react";
import "./Contract.scss";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../Redux/store";
import { loadContract } from "../../../Redux/portal/contractReducer";
import ContractEditor from "./ContractEditor/ContractEditor";

function Contract(): ReactElement {
  const dispatch = useAppDispatch();

  const params = useParams();
  const { contractId } = params;

  useEffect(() => {
    if (contractId) {
      dispatch(loadContract(contractId));
    }
  }, [contractId]);

  return (
    <div className="contract-wrapper">
      <div className="contract-container">
        <div className="contract-editor">
          <ContractEditor></ContractEditor>
        </div>
        <div className="contract-actions"></div>
      </div>
    </div>
  );
}

export default Contract;
