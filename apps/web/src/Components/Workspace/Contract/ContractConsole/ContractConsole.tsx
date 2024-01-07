import { ReactElement } from "react";
import "./ContractConsole.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import { theme } from "@repo/theme";
import { LoadingTile } from "@repo/ui";

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
                {success ? (
                  ""
                ) : (
                  <div
                    className="compile-error"
                    style={{ color: theme.palette.warning.dark }}
                  >
                    <div>{compile.error.msg}</div>
                    <div>{compile.error.stack}</div>
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
