import { ReactElement } from "react";
import "./ContractConsole.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import { theme } from "@repo/theme";
import { LoadingTile } from "@repo/ui";
import { Alert } from "@mui/material";
import ReactJson from "react-json-view";

function ContractConsole(): ReactElement {
  const { compile } = useSelector((state: RootState) => state.contract);
  const { success, completed, inProgress, result } = compile;

  return (
    <div className="contract-console-wrapper">
      <div className="contract-console-container">
        <div className="contract-console-header">
          <div>Console</div>
          <div>
            {completed ? (
              <div className="compile-status">
                {success ? (
                  <Alert
                    className="mini-alert secondary-light-alert"
                    color="success"
                    icon={false}
                  >
                    success
                  </Alert>
                ) : (
                  <Alert className="mini-alert" color="error" icon={false}>
                    failed
                  </Alert>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="contract-console-body">
          <div>{inProgress ? <LoadingTile></LoadingTile> : ""}</div>
          <div>
            {completed ? (
              <div>
                {success ? (
                  <div className="compile-result">
                    {result.appSpec ? (
                      <div className="app-spec">
                        <ReactJson
                          src={result.appSpec}
                          name={false}
                          displayObjectSize={false}
                          displayDataTypes={false}
                          enableClipboard={false}
                          iconStyle={"square"}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <div className="compile-error">
                    {compile.error.msg ? (
                      <div className="error">
                        <div
                          className="title"
                          style={{ color: theme.palette.warning.dark }}
                        >
                          Message
                        </div>
                        <div className="content">{compile.error.msg}</div>
                      </div>
                    ) : (
                      ""
                    )}

                    {compile.error.stack ? (
                      <div className="error">
                        <div
                          className="title"
                          style={{ color: theme.palette.warning.dark }}
                        >
                          Call stack
                        </div>
                        <div className="content">{compile.error.stack}</div>
                      </div>
                    ) : (
                      ""
                    )}
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
