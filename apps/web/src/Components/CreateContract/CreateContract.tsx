import { ReactElement, useState } from "react";
import "./CreateContract.scss";
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
import { A_Contract, A_Workspace, ContractClient } from "@repo/tealcraft-sdk";
import { useLoader, useSnackbar } from "@repo/ui";

interface CreateContractProps {
  show: boolean;
  onClose: () => void;
  onSuccess: (contract: A_Contract) => void;
  workspace: A_Workspace;
}

function CreateContract({
  show,
  onClose,
  onSuccess,
  workspace,
}: CreateContractProps): ReactElement {
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
            <div>Create contract</div>
            <div>
              <Close onClick={handleClose} className="close-modal" />
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="create-contract-wrapper">
              <div className="create-contract-container">
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <FormLabel className="classic-label">
                        Contract name
                      </FormLabel>
                      <ShadedInput
                        autoFocus
                        value={name}
                        placeholder="My contract"
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
                            showSnack("Invalid contract name", "error");
                            return;
                          }

                          if (name.length < minLength) {
                            showSnack(
                              `Contract name should be at least ${minLength} chars`,
                              "error",
                            );
                            return;
                          }

                          if (name.length > maxLength) {
                            showSnack(
                              `Contract name cannot be more than ${maxLength} chars`,
                              "error",
                            );
                            return;
                          }
                          try {
                            showLoader(
                              "Checking if workspace already exists...",
                            );

                            const exists =
                              await new ContractClient().nameExists(
                                workspace.id,
                                name,
                              );
                            hideLoader();

                            if (exists) {
                              showSnack(
                                "Contract with this name exists already",
                                "error",
                              );
                              return;
                            }

                            showLoader("Creating contract ...");
                            const contract = await new ContractClient().save(
                              workspace.id,
                              name,
                            );
                            hideLoader();
                            handleClose();
                            if (contract) {
                              onSuccess(contract);
                            }

                            showSnack(
                              "Contract created successfully",
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

export default CreateContract;
