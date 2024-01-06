import { ReactElement, useEffect } from "react";
import "./Contract.scss";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../Redux/store";
import { loadContract } from "../../../Redux/portal/contractReducer";
import ContractEditor from "./ContractEditor/ContractEditor";
import { Grid } from "@mui/material";

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
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="contract-editor">
              <ContractEditor></ContractEditor>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Contract;
