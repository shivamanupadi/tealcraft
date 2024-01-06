import { ReactElement, useState } from "react";
import "./ContractActions.scss";
import { Button } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { Compiler } from "@algorandfoundation/tealscript";
import { VERSION } from "@algorandfoundation/tealscript/dist/version";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import { Project } from "ts-morph";
import { CoreContract } from "@repo/tealcraft-sdk";
import axios from "axios";

function ContractActions(): ReactElement {
  const { contract } = useSelector((state: RootState) => state.contract);
  const [appSpec, setAppspec] = useState(null);
  return (
    <div className="contract-actions-wrapper">
      <div className="contract-actions-container">
        <div className="contract-name">
          {contract ? new CoreContract(contract).getNameWithExtension() : ""}
        </div>
        <div>
          <Button
            startIcon={<PlayArrow></PlayArrow>}
            variant={"outlined"}
            color={"secondary"}
            size={"small"}
            onClick={async () => {
              if (contract) {
                const project = new Project({
                  useInMemoryFileSystem: true,
                  compilerOptions: {
                    experimentalDecorators: true,
                  },
                });

                const libDir = "src/lib";

                const indexPath = `${libDir}/index.ts`;
                const contractPath = `${libDir}/contract.ts`;
                const compilerPath = `${libDir}/compiler.ts`;
                const lsigPath = `${libDir}/lsig.ts`;
                const typesPath = "types/global.d.ts";

                const TEALSCRIPT_REF = VERSION;
                const promises = [
                  indexPath,
                  typesPath,
                  contractPath,
                  lsigPath,
                  compilerPath,
                ].map(async (p) => {
                  const url = `https://raw.githubusercontent.com/algorandfoundation/TEALScript/${TEALSCRIPT_REF}/${p}`;
                  const response = await axios.get(url);
                  const text = response.data;
                  project.createSourceFile(p, text);
                });

                await Promise.all(promises);

                const srcPath = `examples/calc/${contract.name}.ts`;
                project.createSourceFile(srcPath, contract.source);

                const compiler = new Compiler({
                  srcPath,
                  className: contract.name,
                  project,
                  cwd: "/",
                });

                await compiler.compile();
                console.log(project);
                console.log(compiler.appSpec());
                setAppspec(compiler.appSpec());
              }
            }}
          >
            Run
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ContractActions;
