import "./ContractProgram.scss";
import React, { ReactElement, useEffect, useState } from "react";
import { Button, ButtonGroup } from "@mui/material";
import { PROGRAM_ENCODING } from "@repo/algocore";
import { CodeBlock, github } from "react-code-blocks";
import { copyContent, downloadFile } from "@repo/utils";
import { ABIContractParams } from "algosdk";

export interface ContractProgramProps {
  type: string;
  program: string;
  contract: ABIContractParams;
}

function ContractProgram({
  type,
  program,
  contract,
}: ContractProgramProps): ReactElement {
  const [encoding, setEncoding] = useState<string>(PROGRAM_ENCODING.TEAL);
  const [prg, setPrg] = useState<string>("");

  useEffect(() => {
    if (encoding === PROGRAM_ENCODING.TEXT) {
      setPrg(program);
    } else if (encoding === PROGRAM_ENCODING.TEAL) {
      setPrg(atob(program));
    }
  }, [encoding]);

  return (
    <div className={"contract-program-wrapper"}>
      <div className={"contract-program-container"}>
        <div className="contract-program-header">
          <div className="title">
            <div className="name">
              {type === "approval" ? "Approval program" : ""}
              {type === "clear" ? "Clear program" : ""}
            </div>
            <div>
              <ButtonGroup variant="outlined">
                <Button
                  size={"small"}
                  color={"secondary"}
                  className="small-button secondary-light-button"
                  variant={
                    encoding === PROGRAM_ENCODING.TEXT
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => {
                    setEncoding(PROGRAM_ENCODING.TEXT);
                  }}
                >
                  Text
                </Button>
                <Button
                  color={"secondary"}
                  size={"small"}
                  className="small-button secondary-light-button"
                  variant={
                    encoding === PROGRAM_ENCODING.TEAL
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => {
                    setEncoding(PROGRAM_ENCODING.TEAL);
                  }}
                >
                  Teal
                </Button>
              </ButtonGroup>
            </div>
          </div>
          <div>
            {encoding === PROGRAM_ENCODING.TEXT ? (
              <Button
                size={"small"}
                className="small-button"
                onClick={(ev) => {
                  copyContent(ev, prg);
                }}
                variant={"contained"}
              >
                Copy
              </Button>
            ) : (
              ""
            )}
            {encoding === PROGRAM_ENCODING.TEAL ? (
              <Button
                size={"small"}
                className="small-button"
                onClick={() => {
                  downloadFile(prg, `${contract.name}.${type}.teal`);
                }}
                variant={"contained"}
              >
                Download
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="contract-program-body">
          {encoding === PROGRAM_ENCODING.TEXT ? (
            <div className="byte">{prg}</div>
          ) : (
            <div className="source">
              <CodeBlock
                text={prg}
                theme={github}
                language="bash"
                showLineNumbers={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContractProgram;
