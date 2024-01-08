import { ReactElement, useState } from "react";
import "./ContractConsole.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import { theme } from "@repo/theme";
import { LoadingTile } from "@repo/ui";
import { Alert, Tab, Tabs } from "@mui/material";
import ContractAppSpec from "./ContractAppSpec/ContractAppSpec";

function ContractConsole(): ReactElement {
  const { compile } = useSelector((state: RootState) => state.contract);
  const { success, completed, inProgress, result } = compile;

  const [tab, setTab] = useState<string>("abi");

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
                    <Tabs
                      value={tab}
                      className="console-tabs"
                      orientation="horizontal"
                      variant={"standard"}
                    >
                      <Tab
                        label="ABI"
                        value="abi"
                        onClick={() => {
                          setTab("abi");
                        }}
                      />
                      <Tab
                        label="App spec"
                        value="app-spec"
                        onClick={() => {
                          setTab("app-spec");
                        }}
                      />
                      <Tab
                        label="TEAL"
                        value="teal"
                        onClick={() => {
                          setTab("teal");
                        }}
                      />
                      <Tab
                        label="State schema"
                        value="state-schema"
                        onClick={() => {
                          setTab("state-schema");
                        }}
                      />
                    </Tabs>

                    <div className="tab-content">
                      {tab === "app-spec" ? (
                        <ContractAppSpec
                          appSpec={result.appSpec}
                        ></ContractAppSpec>
                      ) : (
                        ""
                      )}
                    </div>
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
