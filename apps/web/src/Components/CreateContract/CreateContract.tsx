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
import {
  A_Contract,
  A_Workspace,
  ContractClient,
  TealCraft,
  TealCraftCompiler,
} from "@repo/tealcraft-sdk";
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
                          try {
                            new TealCraft().isValidContractName(name);
                          } catch (e) {
                            showException(e);
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

                            showLoader("Creating contract ...");

                            const defaultSource =
                              new TealCraftCompiler().getDefaultTemplate(
                                workspace,
                                name,
                              );

                            const contract = await new ContractClient().save(
                              workspace,
                              name,
                              defaultSource,
                            );
                            hideLoader();
                            handleClose();
                            if (contract) {
                              onSuccess(contract);
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

export default CreateContract;
