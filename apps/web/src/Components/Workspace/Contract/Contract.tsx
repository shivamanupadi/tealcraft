import { ReactElement, useEffect } from "react";
import "./Contract.scss";
import { useParams } from "react-router-dom";
import { RootState, useAppDispatch } from "../../../Redux/store";
import { loadContract } from "../../../Redux/portal/contractReducer";
import { useSelector } from "react-redux";

function Contract(): ReactElement {
  const dispatch = useAppDispatch();

  const params = useParams();
  const { contractId } = params;

  const { contract } = useSelector((state: RootState) => state.contract);

  useEffect(() => {
    if (contractId) {
      dispatch(loadContract(contractId));
    }
  }, [contractId]);

  return (
    <div className="contract-wrapper">
      <div className="contract-container">{contract?.name}</div>
    </div>
  );
}

export default Contract;
