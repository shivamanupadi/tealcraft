import { ReactElement, useState } from "react";
import "./CreateWorkspace.scss";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormLabel,
  Grid,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { ModalGrowTransition, ShadedInput } from "@repo/theme";
import { useAppDispatch } from "../../../Redux/store";
import { showSnack } from "../../../Redux/app/snackbarReducer";
import { A_Workspace, WorkspaceClient } from "@repo/tealcraft-sdk";
import { useLoader } from "../../../hooks/Loader/Loader";
import { getExceptionMsg } from "@repo/utils";

interface CreateWorkspaceProps {
  show: boolean;
  onClose: () => void;
  onSuccess: (workspace: A_Workspace) => void;
}

function CreateWorkspace({
  show,
  onClose,
  onSuccess,
}: CreateWorkspaceProps): ReactElement {
  const dispatch = useAppDispatch();
  const { showLoader, hideLoader } = useLoader();
  const [name, setName] = useState<string>("");

  const clearState = () => {
    setName("");
  };

  function handleClose() {
    clearState();
    onClose();
  }

  return (
    <div>
      {show ? (
        <Dialog
          onClose={handleClose}
          maxWidth={"xs"}
          open={show}
          TransitionComponent={ModalGrowTransition}
          transitionDuration={400}
          className="classic-modal"
        >
          <DialogTitle>
            <div>Create workspace</div>
            <div>
              <Close onClick={handleClose} className="close-modal" />
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="create-workspace-wrapper">
              <div className="create-workspace-container">
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <FormLabel className="classic-label">
                        Workspace name
                      </FormLabel>
                      <ShadedInput
                        autoFocus
                        value={name}
                        placeholder="My project"
                        onChange={(ev: any) => {
                          setName(ev.target.value);
                        }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Button
                        color={"primary"}
                        fullWidth
                        type="submit"
                        variant={"contained"}
                        sx={{ marginTop: "20px" }}
                        onClick={async () => {
                          const minLength = 5;
                          const maxLength = 30;
                          if (!name) {
                            dispatch(
                              showSnack({
                                severity: "error",
                                message: "Invalid workspace name",
                              }),
                            );
                            return;
                          }

                          if (name.length < minLength) {
                            dispatch(
                              showSnack({
                                severity: "error",
                                message: `Workspace name should be at least ${minLength} chars`,
                              }),
                            );
                            return;
                          }

                          if (name.length > maxLength) {
                            dispatch(
                              showSnack({
                                severity: "error",
                                message: `Workspace name cannot be more than ${maxLength} chars`,
                              }),
                            );
                            return;
                          }
                          try {
                            showLoader(
                              "Checking if workspace already exists...",
                            );

                            const exists =
                              await new WorkspaceClient().nameExists(name);
                            hideLoader();

                            if (exists) {
                              dispatch(
                                showSnack({
                                  severity: "error",
                                  message:
                                    "Workspace with this name exists already",
                                }),
                              );
                              return;
                            }

                            showLoader("Creating workspace...");
                            const workspace = await new WorkspaceClient().save(
                              name,
                            );
                            hideLoader();
                            handleClose();
                            if (workspace) {
                              onSuccess(workspace);
                            }
                            dispatch(
                              showSnack({
                                severity: "success",
                                message: "Workspace created successfully",
                              }),
                            );
                          } catch (e) {
                            hideLoader();
                            const msg = getExceptionMsg(e);
                            if (msg) {
                              dispatch(
                                showSnack({
                                  severity: "error",
                                  message: msg,
                                }),
                              );
                            }
                          }
                        }}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        ""
      )}
    </div>
  );
}

export default CreateWorkspace;
