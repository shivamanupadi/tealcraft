import { ReactElement, useState } from "react";
import "./ContractConsole.scss";
import { useSelector } from "react-redux";
import { theme } from "@repo/theme";
import { LoadingTile } from "@repo/ui";
import { Button, Tab, Tabs } from "@mui/material";
import AppSpecMore from "./AppSpecMore/AppSpecMore";
import { CheckCircle, Error } from "@mui/icons-material";
import ABIVisualizer from "./ABIVisualizer/ABIVisualizer";
import ContractSchema from "./ContractSchema/ContractSchema";
import ContractPrograms from "./ContractPrograms/ContractPrograms";
import { RootState } from "../../../Redux/store";
import JsonViewer from "../../../Components/JsonViewer/JsonViewer";

function ContractConsole(): ReactElement {
  const { compile } = useSelector((state: RootState) => state.contract);
  const { success, completed, inProgress, result } = compile;

  const [tab, setTab] = useState<string>("abi");
  const [isAppSpecJsonVisible, setAppSpecJsonVisibility] =
    useState<boolean>(false);

  return (
    <div className="contract-console-wrapper">
      <div className="contract-console-container">
        <div className="contract-console-header">
          <div className="title">
            <div>Console</div>
          </div>

          <div>
            {completed ? (
              <div>
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
          <div>
            {inProgress ? (
              <div className="loading">
                <LoadingTile></LoadingTile>
              </div>
            ) : (
              ""
            )}
          </div>
          <div>
            {completed ? (
              <div>
                {success ? (
                  <div className="compile-result">
                    <div className="app-spec-header">
                      <div>Application Spec [ARC-32]</div>
                      <div className="app-spec-header-actions">
                        <div>
                          <Button
                            color={"primary"}
                            onClick={() => {
                              setAppSpecJsonVisibility(true);
                            }}
                            variant={"contained"}
                            className="small-button"
                            size={"small"}
                          >
                            JSON
                          </Button>

                          <JsonViewer
                            show={isAppSpecJsonVisible}
                            onClose={() => {
                              setAppSpecJsonVisibility(false);
                            }}
                            json={result.appSpec}
                            title={"Application spec"}
                            fileName={`${result.appSpec?.contract.name}.application`}
                          ></JsonViewer>
                        </div>
                      </div>
                    </div>
                    <Tabs
                      value={tab}
                      className="console-tabs"
                      orientation="horizontal"
                      variant={"fullWidth"}
                      indicatorColor={"secondary"}
                      textColor="secondary"
                    >
                      <Tab
                        label="ABI"
                        value="abi"
                        onClick={() => {
                          setTab("abi");
                        }}
                      />
                      <Tab
                        label="Schema"
                        value="schema"
                        onClick={() => {
                          setTab("schema");
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
                        label="More ..."
                        value="more"
                        onClick={() => {
                          setTab("more");
                        }}
                      />
                    </Tabs>

                    <div className="tab-content">
                      {tab === "abi" && result.appSpec ? (
                        <ABIVisualizer
                          abi={result.appSpec?.contract}
                          appSpec={result.appSpec}
                        ></ABIVisualizer>
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

                      {tab === "teal" && result.appSpec ? (
                        <div>
                          <ContractPrograms
                            appSpec={result.appSpec}
                          ></ContractPrograms>
                        </div>
                      ) : (
                        ""
                      )}

                      {tab === "more" && result.appSpec ? (
                        <AppSpecMore appSpec={result.appSpec}></AppSpecMore>
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
