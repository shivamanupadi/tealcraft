import "./ContractPrograms.scss";
import { ReactElement, useState } from "react";
import { Button } from "@mui/material";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import ApplicationProgram from "../../../../Components/ApplicationProgram/ApplicationProgram";
import { ArrowRightAlt } from "@mui/icons-material";

export interface ContractProgramsProps {
  appSpec: AppSpec;
}

function ContractPrograms({ appSpec }: ContractProgramsProps): ReactElement {
  const [isApprovalPrgVisible, setApprovalPrgVisibility] =
    useState<boolean>(false);
  const [isClearPrgVisible, setClearPrgVisibility] = useState<boolean>(false);

  return (
    <div className={"contract-programs-wrapper"}>
      <div className={"contract-programs-container"}>
        <div className="section">
          <div className="title">Approval program</div>
          <div className="desc">
            When a transaction is submitted to the Algorand network, it is
            evaluated against the approval program associated with the smart
            contract involved. If the conditions specified in the approval
            program are met, the transaction is approved and executed;
            otherwise, it is rejected.
          </div>
          <Button
            variant={"contained"}
            size={"small"}
            endIcon={<ArrowRightAlt></ArrowRightAlt>}
            onClick={() => {
              setApprovalPrgVisibility(true);
            }}
          >
            Open
          </Button>
          <ApplicationProgram
            show={isApprovalPrgVisible}
            onClose={() => {
              setApprovalPrgVisibility(false);
            }}
            program={appSpec.source.approval}
            type="approval"
            contract={appSpec.contract}
          ></ApplicationProgram>
        </div>
        <div className="section">
          <div className="title">Clear program</div>
          <div className="desc">
            The clear program specifies the logic that must be satisfied for the
            smart contract to allow its state to be removed or reset
          </div>
          <Button
            variant={"contained"}
            size={"small"}
            endIcon={<ArrowRightAlt></ArrowRightAlt>}
            onClick={() => {
              setClearPrgVisibility(true);
            }}
          >
            Open
          </Button>
          <ApplicationProgram
            show={isClearPrgVisible}
            onClose={() => {
              setClearPrgVisibility(false);
            }}
            program={appSpec.source.clear}
            type="clear"
            contract={appSpec.contract}
          ></ApplicationProgram>
        </div>
      </div>
    </div>
  );
}

export default ContractPrograms;
