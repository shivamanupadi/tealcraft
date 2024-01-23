import { ReactElement } from "react";
import "./ContractEditor.scss";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import ContractHeader from "../ContractHeader/ContractHeader";
import ContractConsole from "../ContractConsole/ContractConsole";
import { RootState } from "../../../Redux/store";
import TealScriptEditor from "./TealScriptEditor/TealScriptEditor";
import { CoreContract } from "@repo/tealcraft-sdk";
import PuyaEditor from "./PuyaEditor/PuyaEditor";

function ContractEditor(): ReactElement {
  const { contract } = useSelector((state: RootState) => state.contract);

  return (
    <div className="contract-editor-wrapper">
      <div className="contract-editor-container">
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <div>
              <div className="contract-editor-header">
                <ContractHeader></ContractHeader>
              </div>
              {contract &&
              new CoreContract(contract).getFrameworkId() === "tealscript" ? (
                <TealScriptEditor></TealScriptEditor>
              ) : (
                ""
              )}

              {contract &&
              new CoreContract(contract).getFrameworkId() === "puya" ? (
                <PuyaEditor></PuyaEditor>
              ) : (
                ""
              )}
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <ContractConsole></ContractConsole>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default ContractEditor;
