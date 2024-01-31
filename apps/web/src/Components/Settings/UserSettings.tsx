import { ReactElement } from "react";
import "./UserSettings.scss";
import { Button, Drawer } from "@mui/material";
import { ContractClient, TealCraft } from "@repo/tealcraft-sdk";
import { confirmationProps } from "@repo/theme";
import { loadWorkspaces } from "../../Redux/portal/portalReducer";
import { useConfirm } from "material-ui-confirm";
import { useLoader, useSnackbar } from "@repo/ui";
import { useAppDispatch } from "../../Redux/store";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";

interface UserSettingsProps {
  show: boolean;
  onClose: () => void;
}

const buttonSx = {
  width: "80px",
};

function UserSettings({ show, onClose }: UserSettingsProps): ReactElement {
  const confirmation = useConfirm();
  const { showLoader, hideLoader } = useLoader();
  const { showSnack, showException } = useSnackbar();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleClose() {
    onClose();
  }

  return (
    <div>
      {show ? (
        <Drawer
          sx={{
            ".MuiDrawer-paper": {
              width: "30%",
            },
          }}
          anchor={"right"}
          open={show}
          onClose={handleClose}
        >
          <div className="user-settings-wrapper">
            <div className="user-settings-container">
              <div className="user-settings-header">
                <div className="title">Settings</div>
                <div className="actions">
                  <Close className="hover" onClick={handleClose}></Close>
                </div>
              </div>
              <div className="user-settings-body">
                <div className="section">
                  <div className="section-title">
                    One TealScript and one Puya workspace with preloaded example
                    contracts.
                  </div>
                  <div className="section-body">
                    <Button
                      color={"primary"}
                      variant={"contained"}
                      sx={buttonSx}
                      onClick={async () => {
                        confirmation({
                          ...confirmationProps,
                          description: `One TealScript and one Puya workspace with preloaded contracts will be created.`,
                        })
                          .then(async () => {
                            try {
                              showLoader("Creating demo workspace...");
                              const workspaceId =
                                await new TealCraft().loadDemoData();
                              hideLoader();

                              showSnack(
                                "Demo workspace created successfully",
                                "success",
                              );
                              dispatch(loadWorkspaces());
                              new TealCraft().saveWorkspaceId(workspaceId);
                              const contracts =
                                await new ContractClient().findByWorkspace(
                                  workspaceId,
                                );
                              if (contracts && contracts.length > 0) {
                                navigate(
                                  `/portal/workspace/${workspaceId}/contract/${contracts[0]?.id}`,
                                );
                              } else {
                                navigate(`/portal/workspace/${workspaceId}`);
                              }
                              handleClose();
                            } catch (e) {
                              hideLoader();
                              showException(e);
                            }
                          })
                          .catch(() => {});
                      }}
                    >
                      Create
                    </Button>
                  </div>
                </div>

                <div className="section">
                  <div className="section-title">
                    Export your TealCraft data
                  </div>
                  <div className="section-body">
                    <Button
                      color={"primary"}
                      variant={"contained"}
                      sx={buttonSx}
                      onClick={async () => {
                        try {
                          showLoader("Exporting your data...");
                          await new TealCraft().exportData();
                          hideLoader();
                        } catch (e) {
                          hideLoader();
                          showException(e);
                        }
                      }}
                    >
                      Export
                    </Button>
                  </div>
                </div>

                <div className="section">
                  <div className="section-title">
                    Import your TealCraft data
                  </div>
                  <div className="section-body">
                    <Button
                      color={"primary"}
                      variant={"contained"}
                      sx={buttonSx}
                      component="label"
                    >
                      Import
                      <input
                        type="file"
                        accept=".json"
                        hidden
                        multiple={false}
                        onChange={async (ev) => {
                          // @ts-ignore
                          const file = ev.target.files[0];

                          const reader = new FileReader();
                          reader.addEventListener(
                            "load",
                            async function () {
                              try {
                                showLoader("Importing data ...");
                                const data = reader.result?.toString();
                                await new TealCraft().importData(data);

                                showSnack(
                                  "Data imported successfully",
                                  "success",
                                );
                                dispatch(loadWorkspaces());
                                hideLoader();
                                handleClose();
                              } catch (e: any) {
                                hideLoader();
                                showException(e);
                              }
                            },
                            false,
                          );

                          if (file) {
                            reader.readAsText(file);
                          }
                        }}
                      />
                    </Button>
                  </div>
                </div>

                <div className="section">
                  <div className="section-title">
                    Factory reset your TealCraft data
                  </div>
                  <div className="section-body">
                    <Button
                      color={"primary"}
                      variant={"contained"}
                      sx={buttonSx}
                      onClick={async () => {
                        confirmation({
                          ...confirmationProps,
                          description: `Complete TealCraft data will be deleted.`,
                        })
                          .then(async () => {
                            try {
                              showLoader("Factory reset in progress...");
                              await new TealCraft().factoryReset();
                              hideLoader();

                              showSnack("Factory reset successful.", "success");
                              dispatch(loadWorkspaces());
                              navigate(`/portal`);
                              handleClose();
                            } catch (e) {
                              hideLoader();
                              showException(e);
                            }
                          })
                          .catch(() => {});
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      ) : (
        ""
      )}
    </div>
  );
}

export default UserSettings;
