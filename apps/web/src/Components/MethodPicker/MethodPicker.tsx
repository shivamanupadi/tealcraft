import { ReactElement, useState } from "react";
import "./MethodPicker.scss";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Done, UnfoldMore } from "@mui/icons-material";
import { theme } from "@repo/theme";
import { ABIMethodParams } from "algosdk";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";

interface MethodPickerProps {
  onPick: (method: ABIMethodParams) => void;
  selectedMethod: ABIMethodParams | null;
  appSpec: AppSpec;
}

function MethodPicker({
  onPick,
  appSpec,
  selectedMethod,
}: MethodPickerProps): ReactElement {
  const [methodAnchorEl, setMethodAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const { methods } = appSpec.contract;
  return (
    <div className="method-picker-wrapper">
      <div className="method-picker-container">
        <Button
          color={"primary"}
          variant={"contained"}
          size={"small"}
          className="grey-button"
          endIcon={<UnfoldMore />}
          onClick={(ev) => {
            setMethodAnchorEl(ev.currentTarget);
          }}
        >
          {selectedMethod ? (
            <div className="current-method">
              <div>{selectedMethod.name}</div>
            </div>
          ) : (
            "--None--"
          )}
        </Button>

        <Menu
          anchorEl={methodAnchorEl}
          open={Boolean(methodAnchorEl)}
          disableAutoFocusItem={true}
          className="classic-menu"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onClose={() => {
            setMethodAnchorEl(null);
          }}
        >
          {methods.map((method, index) => {
            return (
              <MenuItem
                key={`${method.name}-${index}`}
                selected={false}
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMethodAnchorEl(null);
                  onPick(method);
                }}
              >
                {selectedMethod ? (
                  <ListItemIcon>
                    {selectedMethod.name === method.name ? (
                      <Done
                        fontSize="small"
                        sx={{ color: theme.palette.common.black }}
                      />
                    ) : (
                      ""
                    )}
                  </ListItemIcon>
                ) : (
                  ""
                )}
                <ListItemText>{method.name}</ListItemText>
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    </div>
  );
}

export default MethodPicker;
