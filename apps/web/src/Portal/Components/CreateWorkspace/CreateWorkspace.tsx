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
import { A_Workspace, WorkspaceClient } from "@repo/tealcraft-sdk";
import { useLoader } from "../../../hooks/Loader/Loader";
import { useSnackbar } from "../../../hooks/Snackbar/Snackbar";

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
  const { showLoader, hideLoader } = useLoader();
  const { showSnack, showException } = useSnackbar();
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
                            showSnack("Invalid workspace name", "error");
                            return;
                          }

                          if (name.length < minLength) {
                            showSnack(
                              `Workspace name should be at least ${minLength} chars`,
                              "error",
                            );
                            return;
                          }

                          if (name.length > maxLength) {
                            showSnack(
                              `Workspace name cannot be more than ${maxLength} chars`,
                              "error",
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
                              showSnack(
                                "Workspace with this name exists already",
                                "error",
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

                            showSnack(
                              "Workspace created successfully",
                              "success",
                            );
                          } catch (e) {
                            hideLoader();
                            showException(e);
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
