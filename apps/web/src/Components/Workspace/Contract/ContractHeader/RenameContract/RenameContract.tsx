import { ReactElement, useEffect, useState } from "react";
import "./RenameContract.scss";
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
import { isValidClassName } from "@repo/utils";

interface RenameContractProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workspace: A_Workspace;
  contract: A_Contract;
}

function RenameContract({
  show,
  onClose,
  onSuccess,
  workspace,
  contract,
}: RenameContractProps): ReactElement {
  const { showLoader, hideLoader } = useLoader();
  const { showSnack, showException } = useSnackbar();
  const [name, setName] = useState<string>(contract.name);

  const clearState = () => {
    setName("");
  };

  useEffect(() => {
    if (show) {
      setName(contract.name);
    }
  }, [show]);
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
            <div>Rename contract</div>
            <div>
              <Close onClick={handleClose} className="close-modal" />
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="rename-contract-wrapper">
              <div className="rename-contract-container">
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

                          if (!isValidClassName(name)) {
                            showSnack(
                              `Contract name should be a valid typescript class name`,
                              "error",
                            );
                            return;
                          }

                          if (name === contract.name) {
                            handleClose();
                            return;
                          }

                          try {
                            showLoader(
                              "Checking if contract already exists...",
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

                            showLoader("Renaming contract ...");

                            await new ContractClient().rename(
                              contract.id,
                              name,
                            );
                            hideLoader();
                            handleClose();
                            if (contract) {
                              onSuccess();
                            }
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

export default RenameContract;
