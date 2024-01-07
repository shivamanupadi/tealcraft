import { ReactElement } from "react";
import "./ContractConsole.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import { theme } from "@repo/theme";
import { LoadingTile } from "@repo/ui";
import { Alert } from "@mui/material";

function ContractConsole(): ReactElement {
  const { compile } = useSelector((state: RootState) => state.contract);
  const { success, completed, inProgress } = compile;

  return (
    <div className="contract-console-wrapper">
      <div className="contract-console-container">
        <div className="contract-console-header">Console</div>
        <div className="contract-console-body">
          <div>{inProgress ? <LoadingTile></LoadingTile> : ""}</div>
          <div>
            {completed ? (
              <div>
                <div className="compile-status">
                  {success ? (
                    <Alert
                      className="mini-alert secondary-light-alert"
                      color="success"
                      icon={false}
                    >
                      Compiled successfully
                    </Alert>
                  ) : (
                    <Alert className="mini-alert" color="error" icon={false}>
                      Compilation failed
                    </Alert>
                  )}
                </div>
                {success ? (
                  ""
                ) : (
                  <div className="compile-error">
                    <div className="error">
                      <div
                        className="title"
                        style={{ color: theme.palette.warning.dark }}
                      >
                        Message
                      </div>
                      <div className="content">{compile.error.msg}</div>
                    </div>
                    <div className="error">
                      <div
                        className="title"
                        style={{ color: theme.palette.warning.dark }}
                      >
                        Call stack
                      </div>
                      <div className="content">{compile.error.stack}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractConsole;
