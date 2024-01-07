import { ReactElement } from "react";
import "./ContractHeader.scss";
import { Button } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import { CoreContract, TealCraftCompiler } from "@repo/tealcraft-sdk";

function ContractHeader(): ReactElement {
  const { contract, source } = useSelector(
    (state: RootState) => state.contract,
  );

  return (
    <div className="contract-header-wrapper">
      <div className="contract-header-container">
        <div className="contract-name">
          {contract ? new CoreContract(contract).getNameWithExtension() : ""}
        </div>
        <div className="contract-actions">
          <div className="compiler">
            Compiler version : {new TealCraftCompiler().getTealScriptVersion()}
          </div>
          <div>
            <Button
              startIcon={<PlayArrow></PlayArrow>}
              variant={"outlined"}
              color={"secondary"}
              size={"small"}
              onClick={async () => {
                if (contract) {
                  const compiler = await new TealCraftCompiler().compile({
                    ...contract,
                    source,
                  });
                  console.log(compiler.appSpec());
                }
              }}
            >
              Run
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractHeader;
