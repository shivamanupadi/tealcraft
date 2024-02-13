import React, { ReactElement, useEffect, useState } from "react";
import "./ApplicationProgram.scss";
import { Button, ButtonGroup, Drawer } from "@mui/material";
import { GreyColors } from "@repo/theme";
import { Close } from "@mui/icons-material";
import { Fragment } from "react";
import { ABIContractParams } from "algosdk";
import { PROGRAM_ENCODING } from "@repo/algocore";
import { copyContent, downloadFile } from "@repo/utils";
import { CodeBlock, github } from "react-code-blocks";

interface ApplicationProgramProps {
  show: boolean;
  onClose: () => void;
  type: string;
  program: string;
  contract: ABIContractParams;
}

function ApplicationProgram({
  show,
  onClose,
  type,
  program,
  contract,
}: ApplicationProgramProps): ReactElement {
  const [encoding, setEncoding] = useState<string>(PROGRAM_ENCODING.TEAL);
  const [prg, setPrg] = useState<string>("");

  useEffect(() => {
    if (encoding === PROGRAM_ENCODING.TEXT) {
      setPrg(program);
    } else if (encoding === PROGRAM_ENCODING.TEAL) {
      setPrg(atob(program));
    }
  }, [encoding]);

  useEffect(() => {
    if (show) {
      setEncoding(PROGRAM_ENCODING.TEAL);
    }
  }, [show]);

  function handleClose() {
    onClose();
  }

  return (
    <div>
      <Fragment>
        <Drawer
          sx={{
            ".MuiDrawer-paper": {
              width: "40%",
              background: GreyColors.F8F8F9,
            },
          }}
          ModalProps={{
            BackdropProps: {
              style: {
                background: "transparent",
              },
            },
          }}
          anchor={"right"}
          open={show}
          onClose={handleClose}
        >
          <div className="application-program-wrapper">
            <div className="application-program-container">
              <div className="application-program-header">
                <div className="title">
                  {type === "approval" ? "Approval program" : ""}
                  {type === "clear" ? "Clear program" : ""}
                </div>
                <div className="actions">
                  <Close className="hover" onClick={handleClose}></Close>
                </div>
              </div>
              <div className="application-program-body">
                <div className="contract-program-header">
                  <div className="title">
                    <div>
                      <ButtonGroup variant="outlined">
                        <Button
                          size={"small"}
                          color={"secondary"}
                          className="secondary-light-button"
                          variant={
                            encoding === PROGRAM_ENCODING.TEXT
                              ? "contained"
                              : "outlined"
                          }
                          onClick={() => {
                            setEncoding(PROGRAM_ENCODING.TEXT);
                          }}
                        >
                          Byte
                        </Button>
                        <Button
                          color={"secondary"}
                          size={"small"}
                          className="secondary-light-button"
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
          </div>
        </Drawer>
      </Fragment>
    </div>
  );
}

export default ApplicationProgram;
