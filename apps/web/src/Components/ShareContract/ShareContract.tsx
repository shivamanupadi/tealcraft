import { ReactElement, useEffect, useState } from "react";
import "./ShareContract.scss";
import { useParams } from "react-router-dom";
import { ContractFiddleClient } from "@repo/tealcraft-sdk";
import { REACT_APP_API_URL } from "../../env";
import { ContractFiddleParams } from "@repo/types";
import { LoadingTile } from "@repo/ui";
import { useAppDispatch } from "../../Redux/store";
import { loadWorkspaces } from "../../Redux/portal/portalReducer";
import { Button, FormLabel, Grid } from "@mui/material";
import WorkspaceSelector from "../../Pages/Share/WorkspaceSelector/WorkspaceSelector";

function ShareContract(): ReactElement {
  const dispatch = useAppDispatch();
  const [fiddle, setFiddle] = useState<ContractFiddleParams | null>(null);
  const [isLoaderVisible, setLoaderVisibility] = useState<boolean>(false);

  const params = useParams();
  const { fiddleId } = params;

  async function loadFiddle(fiddleId: number) {
    try {
      setLoaderVisibility(true);
      const fiddle = await new ContractFiddleClient(
        REACT_APP_API_URL,
      ).getFiddle(fiddleId);
      setFiddle(fiddle);
      setLoaderVisibility(false);
    } catch (e) {
      setLoaderVisibility(false);
    }
  }

  useEffect(() => {
    if (fiddleId) {
      loadFiddle(parseInt(fiddleId));
    }
  }, [fiddleId]);

  useEffect(() => {
    dispatch(loadWorkspaces());
  }, []);

  return (
    <div className="share-contract-wrapper">
      <div className="share-contract-container">
        {isLoaderVisible ? (
          <div className="loader">
            <LoadingTile count={8}></LoadingTile>
          </div>
        ) : (
          <div>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <FormLabel className="classic-label">Contract</FormLabel>
                  <div>
                    <FormLabel className="classic-value">
                      {fiddle?.name}
                    </FormLabel>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <FormLabel className="classic-label">Created at</FormLabel>
                  <div>
                    <FormLabel className="classic-value">
                      {fiddle?.createdAt}
                    </FormLabel>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <FormLabel className="classic-label">Workspace</FormLabel>
                  <div>
                    <WorkspaceSelector></WorkspaceSelector>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button variant={"contained"} color={"primary"} fullWidth>
                    Import
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShareContract;
