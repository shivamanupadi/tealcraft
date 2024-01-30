import { ReactElement, useEffect, useState } from "react";
import "./ShareContract.scss";
import { useNavigate, useParams } from "react-router-dom";
import {
  A_Workspace,
  ContractFiddleClient,
  CoreContractFiddle,
  CoreWorkspace,
} from "@repo/tealcraft-sdk";
import { ContractFiddleParams } from "@repo/types";
import { LoadingTile, useLoader, useSnackbar } from "@repo/ui";
import { useAppDispatch } from "../../Redux/store";
import { loadWorkspaces } from "../../Redux/portal/portalReducer";
import { Button, FormLabel, Grid } from "@mui/material";
import WorkspaceSelector from "../../Pages/Share/WorkspaceSelector/WorkspaceSelector";
import { API_FIDDLES_URL } from "../../constants";
import { convertUTCDateToLocalDate } from "@repo/utils";

function ShareContract(): ReactElement {
  const dispatch = useAppDispatch();
  const { showSnack, showException } = useSnackbar();
  const { showLoader, hideLoader } = useLoader();
  const [fiddle, setFiddle] = useState<ContractFiddleParams | null>(null);
  const [isLoaderVisible, setLoaderVisibility] = useState<boolean>(false);
  const [workspace, setWorkspace] = useState<null | A_Workspace>(null);
  const navigate = useNavigate();

  const params = useParams();
  const { fiddleId } = params;

  async function importFiddle() {
    if (!fiddle) {
      return;
    }

    if (!workspace) {
      showSnack("Please select a workspace to import", "error");
      return;
    }

    if (!new CoreContractFiddle(fiddle).canImportToWorkspace(workspace)) {
      const fiddleFramework = new CoreContractFiddle(fiddle).getFramework();
      const workspaceFramework = new CoreWorkspace(workspace).getFramework();
      const msg = `You are trying to import ${fiddleFramework?.label} contract into ${workspaceFramework?.label} workspace`;
      showSnack(msg, "error");
      return;
    }

    try {
      showLoader("Importing contract ...");
      const contract = await new CoreContractFiddle(fiddle).importToWorkspace(
        workspace,
      );
      hideLoader();
      showSnack("Contract imported successfully", "success");
      navigate(`/portal/workspace/${workspace.id}/contract/${contract?.id}`);
    } catch (e) {
      hideLoader();
      showException(e);
    }
  }

  async function loadFiddle(fiddleId: number) {
    try {
      setLoaderVisibility(true);
      const fiddle = await new ContractFiddleClient(API_FIDDLES_URL).getFiddle(
        fiddleId,
      );
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
                      {fiddle
                        ? new CoreContractFiddle(fiddle).getNameWithExtension()
                        : ""}
                    </FormLabel>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <FormLabel className="classic-label">Framework</FormLabel>
                  <div>
                    <FormLabel className="classic-value">
                      {fiddle ? (
                        <div className="framework">
                          <div>
                            <img
                              src={new CoreContractFiddle(fiddle).getLogo()}
                              alt="framework-logo"
                            />
                          </div>
                          <div>
                            {
                              new CoreContractFiddle(fiddle).getFramework()
                                ?.label
                            }
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </FormLabel>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <FormLabel className="classic-label">Created at</FormLabel>
                  <div>
                    <FormLabel className="classic-value">
                      {fiddle?.createdAt
                        ? convertUTCDateToLocalDate(
                            new Date(fiddle.createdAt),
                          ).toLocaleString()
                        : ""}
                    </FormLabel>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <FormLabel className="classic-label">
                    Select workspace to import
                  </FormLabel>
                  <div style={{ marginTop: "5px" }}>
                    <WorkspaceSelector
                      onSelect={(workspace: A_Workspace) => {
                        setWorkspace(workspace);
                      }}
                    ></WorkspaceSelector>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    fullWidth
                    onClick={() => {
                      importFiddle();
                    }}
                  >
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
