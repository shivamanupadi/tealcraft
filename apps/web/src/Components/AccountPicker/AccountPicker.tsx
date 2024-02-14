import { ReactElement, useState } from "react";
import "./AccountPicker.scss";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Done, UnfoldMore } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../Redux/store";
import { AccountClient, TealCraft } from "@repo/tealcraft-sdk";
import { useConfirm } from "material-ui-confirm";
import { useLoader, useSnackbar } from "@repo/ui";
import { useNavigate } from "react-router-dom";
import {
  loadAccounts,
  loadSelectedAccount,
} from "../../Redux/portal/accountReducer";
import { mnemonicAccount } from "@algorandfoundation/algokit-utils";
import { generateAccount, secretKeyToMnemonic } from "algosdk";
import { ellipseString } from "@repo/utils";

function AccountPicker(): ReactElement {
  const dispatch = useAppDispatch();
  const confirmation = useConfirm();
  const navigate = useNavigate();

  const { showLoader, hideLoader } = useLoader();
  const { showSnack, showException } = useSnackbar();

  const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const { accounts, selectedAccount } = useSelector(
    (state: RootState) => state.accounts,
  );

  return (
    <div className="workspace-picker-wrapper">
      <div className="workspace-picker-container">
        <Button
          color={"primary"}
          variant={"contained"}
          className="grey-button"
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
          className="classic-menu workspaces-list"
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
                  <div className="workspace-picker-name">
                    <div>{mnemonicAccount(account.mnemonic).addr}</div>
                  </div>
                </ListItemText>
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
            <Button
              color={"primary"}
              variant={"contained"}
              size={"small"}
              sx={{ marginLeft: "32px" }}
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
