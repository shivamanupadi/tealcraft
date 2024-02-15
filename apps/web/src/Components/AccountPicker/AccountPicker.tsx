import { ReactElement, useState } from "react";
import "./AccountPicker.scss";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  ContentPaste,
  DeleteOutlined,
  Done,
  OpenInNew,
  UnfoldMore,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../Redux/store";
import { AccountClient, TealCraft } from "@repo/tealcraft-sdk";
import { useConfirm } from "material-ui-confirm";
import { useLoader, useSnackbar } from "@repo/ui";
import {
  loadAccounts,
  loadSelectedAccount,
} from "../../Redux/portal/accountReducer";
import { mnemonicAccount } from "@algorandfoundation/algokit-utils";
import { generateAccount, secretKeyToMnemonic } from "algosdk";
import { copyContent, ellipseString } from "@repo/utils";
import { confirmationProps } from "@repo/theme";
import { CoreNode } from "@repo/algocore";
import { Explorer } from "@repo/algocore/src/explorer/explorer";

function AccountPicker(): ReactElement {
  const dispatch = useAppDispatch();
  const confirmation = useConfirm();

  const { showLoader, hideLoader } = useLoader();
  const { showSnack, showException } = useSnackbar();

  const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const { accounts, selectedAccount } = useSelector(
    (state: RootState) => state.accounts,
  );

  const { status, health, genesis, versionsCheck } = useSelector(
    (state: RootState) => state.node,
  );

  const coreNodeInstance = new CoreNode(status, versionsCheck, genesis, health);

  return (
    <div className="account-picker-wrapper">
      <div className="account-picker-container">
        <Button
          color={"primary"}
          variant={"contained"}
          size={"small"}
          startIcon={
            <span style={{ fontSize: "14px" }}>
              {selectedAccount ? (
                <Tooltip title="View in explorer">
                  <OpenInNew
                    fontSize={"small"}
                    sx={{
                      fontSize: "18px !important",
                      verticalAlign: "middle",
                    }}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      ev.preventDefault();
                      if (selectedAccount) {
                        new Explorer(coreNodeInstance).openAddress(
                          mnemonicAccount(selectedAccount.mnemonic).addr,
                        );
                      }
                    }}
                  ></OpenInNew>
                </Tooltip>
              ) : (
                ""
              )}
            </span>
          }
          endIcon={<UnfoldMore />}
          onClick={(ev) => {
            setAccountAnchorEl(ev.currentTarget);
          }}
        >
          {selectedAccount ? (
            <div className="current-workspace">
              <div>
                {ellipseString(mnemonicAccount(selectedAccount.mnemonic).addr)}
              </div>
            </div>
          ) : (
            "Select account"
          )}
        </Button>
        <Menu
          anchorEl={accountAnchorEl}
          open={Boolean(accountAnchorEl)}
          disableAutoFocusItem={true}
          onClose={() => {
            setAccountAnchorEl(null);
          }}
          className="classic-menu accounts-list"
        >
          {accounts.map((account, index) => {
            return (
              <MenuItem
                key={`${account.id}-${index}`}
                selected={false}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAccountAnchorEl(null);
                  new TealCraft().saveAccountId(account.id);
                  dispatch(loadSelectedAccount());
                }}
              >
                {selectedAccount ? (
                  <ListItemIcon>
                    {selectedAccount.id === account.id ? (
                      <Done fontSize="small" />
                    ) : (
                      ""
                    )}
                  </ListItemIcon>
                ) : (
                  ""
                )}
                <ListItemText>
                  <div className="account-picker-name">
                    <div>
                      {ellipseString(
                        mnemonicAccount(account.mnemonic).addr,
                        20,
                      )}
                    </div>
                  </div>
                </ListItemText>
                <Tooltip title="View in explorer">
                  <OpenInNew
                    fontSize={"small"}
                    sx={{ marginLeft: "20px", fontSize: "16px !important" }}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      ev.preventDefault();
                      setAccountAnchorEl(null);
                      new Explorer(coreNodeInstance).openAddress(
                        mnemonicAccount(account.mnemonic).addr,
                      );
                    }}
                  ></OpenInNew>
                </Tooltip>
                <Tooltip title="Copy address">
                  <ContentPaste
                    sx={{ marginLeft: "10px", fontSize: "16px !important" }}
                    fontSize={"small"}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      ev.preventDefault();
                      setAccountAnchorEl(null);
                      copyContent(ev, mnemonicAccount(account.mnemonic).addr);
                      showSnack("Account address copied", "success");
                    }}
                  ></ContentPaste>
                </Tooltip>

                <Tooltip title="Delete account">
                  <DeleteOutlined
                    sx={{ marginLeft: "10px" }}
                    fontSize="small"
                    onClick={async (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setAccountAnchorEl(null);

                      confirmation({
                        ...confirmationProps,
                        description: `You are trying to delete the account ${mnemonicAccount(account.mnemonic).addr}`,
                      })
                        .then(async () => {
                          try {
                            showLoader("Deleting account...");
                            await new AccountClient().delete(account.id);
                            hideLoader();
                            showSnack("Account deleted", "success");
                            dispatch(loadAccounts());
                            if (account.id === selectedAccount?.id) {
                              new TealCraft().removeAccountId();
                              dispatch(loadSelectedAccount());
                            }
                          } catch (e) {
                            hideLoader();
                            showException(e);
                          }
                        })
                        .catch(() => {});
                    }}
                  />
                </Tooltip>
              </MenuItem>
            );
          })}

          <MenuItem
            sx={{
              marginTop: "10px",
              marginBottom: "5px",
              "&:hover": { background: "none" },
            }}
            selected={false}
          >
            {selectedAccount ? <ListItemIcon></ListItemIcon> : ""}
            <Button
              color={"primary"}
              variant={"contained"}
              size={"small"}
              onClick={async () => {
                setAccountAnchorEl(null);
                const account = generateAccount();
                const mnemonic = secretKeyToMnemonic(account.sk);
                const newAccount = await new AccountClient().save(mnemonic);
                if (newAccount) {
                  new TealCraft().saveAccountId(newAccount.id);

                  dispatch(loadAccounts());
                  dispatch(loadSelectedAccount());
                }
              }}
            >
              Create account
            </Button>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default AccountPicker;
