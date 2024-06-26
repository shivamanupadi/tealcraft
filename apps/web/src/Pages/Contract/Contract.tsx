import { ReactElement, useEffect } from "react";
import "./Contract.scss";
import { useParams } from "react-router-dom";
import ContractEditor from "./ContractEditor/ContractEditor";
import { Grid } from "@mui/material";
import { useAppDispatch } from "../../Redux/store";
import { loadContract } from "../../Redux/portal/contractReducer";

function Contract(): ReactElement {
  const dispatch = useAppDispatch();

  const params = useParams();
  const { contractId, workspaceId } = params;

  useEffect(() => {
    if (workspaceId && contractId) {
      dispatch(
        loadContract({ workspaceId: workspaceId, contractId: contractId }),
      );
    }
  }, [workspaceId, contractId]);

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
