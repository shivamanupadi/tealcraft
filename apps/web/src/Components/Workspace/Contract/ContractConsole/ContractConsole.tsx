import { ReactElement, useState } from "react";
import "./ContractConsole.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import { theme } from "@repo/theme";
import { LoadingTile } from "@repo/ui";
import { Tab, Tabs } from "@mui/material";
import ContractAppSpec from "./ContractAppSpec/ContractAppSpec";
import { CheckCircle, Error } from "@mui/icons-material";
import ABIVisualizer from "./ABIVisualizer/ABIVisualizer";
import ContractSchema from "./ContractSchema/ContractSchema";
import ContractPrograms from "./ContractPrograms/ContractPrograms";

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
                  <CheckCircle color={"secondary"}></CheckCircle>
                ) : (
                  <Error color={"error"}></Error>
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
                        label="Schema"
                        value="schema"
                        onClick={() => {
                          setTab("schema");
                        }}
                      />
                    </Tabs>

                    <div className="tab-content">
                      {tab === "app-spec" && result.appSpec ? (
                        <ContractAppSpec
                          appSpec={result.appSpec}
                        ></ContractAppSpec>
                      ) : (
                        ""
                      )}

                      {tab === "abi" && result.appSpec ? (
                        <ABIVisualizer
                          abi={result.appSpec?.contract}
                        ></ABIVisualizer>
                      ) : (
                        ""
                      )}

                      {tab === "teal" && result.appSpec ? (
                        <div>
                          <ContractPrograms
                            appSpec={result.appSpec}
                          ></ContractPrograms>
                        </div>
                      ) : (
                        ""
                      )}

                      {tab === "schema" && result.appSpec ? (
                        <div>
                          <div>
                            <ContractSchema
                              title="Global state"
                              schema={result.appSpec.schema.global}
                              storage={result.appSpec.state.global}
                            ></ContractSchema>
                          </div>
                          <div style={{ marginTop: "20px" }}>
                            <ContractSchema
                              title="Local state"
                              schema={result.appSpec.schema.local}
                              storage={result.appSpec.state.local}
                            ></ContractSchema>
                          </div>
                        </div>
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
