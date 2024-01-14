import "./ContractPrograms.scss";
import { ReactElement, useState } from "react";
import ContractProgram from "../ContractProgram/ContractProgram";
import { Tab, Tabs } from "@mui/material";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";

export interface ContractProgramsProps {
  appSpec: AppSpec;
}

function ContractPrograms({ appSpec }: ContractProgramsProps): ReactElement {
  const [tab, setTab] = useState<string>("approval");

  return (
    <div className={"contract-programs-wrapper"}>
      <div className={"contract-programs-container"}>
        <div>
          <Tabs
            value={tab}
            indicatorColor={"secondary"}
            className="programs-tabs"
            orientation="horizontal"
            variant={"fullWidth"}
            textColor={"secondary"}
          >
            <Tab
              label="Approval"
              value="approval"
              onClick={() => {
                setTab("approval");
              }}
            />
            <Tab
              label="Clear"
              value="clear"
              onClick={() => {
                setTab("clear");
              }}
            />
          </Tabs>
        </div>
        <div>
          {tab === "approval" ? (
            <ContractProgram
              program={appSpec.source.approval}
              type="approval"
              contract={appSpec.contract}
            ></ContractProgram>
          ) : (
            ""
          )}

          {tab === "clear" ? (
            <ContractProgram
              program={appSpec.source.clear}
              type="clear"
              contract={appSpec.contract}
            ></ContractProgram>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default ContractPrograms;
