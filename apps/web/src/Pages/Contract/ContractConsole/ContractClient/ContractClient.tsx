import React, { ReactElement, useEffect, useState } from "react";
import "./ContractClient.scss";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { copyContent, downloadFile } from "@repo/utils";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import {
  generate,
  writeDocumentPartsToString,
} from "@algorandfoundation/algokit-client-generator";
import { LoadingTile } from "@repo/ui";
import { Close, TextSnippetOutlined } from "@mui/icons-material";
import { ModalGrowTransition } from "@repo/theme";
import { CodeBlock, github } from "react-code-blocks";

export type ContractAppSpecProps = {
  appSpec: AppSpec;
};

function ContractClient({ appSpec }: ContractAppSpecProps): ReactElement {
  const [generating, setGenerating] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [clientCode, setClientCode] = useState<string>("");
  const [isClientCodeVisible, setClientCodeVisibility] =
    useState<boolean>(false);

  function generateClient(appSpec: AppSpec) {
    try {
      setGenerating(true);
      setSuccess(false);
      const client = generate(appSpec);
      const clientAsString = writeDocumentPartsToString(client);
      setClientCode(clientAsString);
      setSuccess(true);
    } catch (e) {
      /* empty */
    }

    setGenerating(false);
    setCompleted(true);
  }

  useEffect(() => {
    if (appSpec) {
      generateClient(appSpec);
    }
  }, [appSpec]);

  return (
    <div className="contract-client-wrapper">
      <div className="contract-client-container">
        <div className="client-body">
          {generating ? (
            <div>
              <LoadingTile></LoadingTile>
            </div>
          ) : (
            ""
          )}

          {completed ? (
            <div>
              {success ? (
                <div className="client-code-details">
                  <div className="client-code">
                    <div>
                      <TextSnippetOutlined
                        fontSize={"small"}
                      ></TextSnippetOutlined>
                    </div>
                    <div>{`${appSpec.contract.name}.client.ts`}</div>
                  </div>
                  <div className="client-code-actions">
                    <Button
                      color={"secondary"}
                      onClick={() => {
                        setClientCodeVisibility(true);
                      }}
                      variant={"outlined"}
                      className="small-button"
                      size={"small"}
                    >
                      View
                    </Button>
                    <Button
                      color={"secondary"}
                      onClick={(ev) => {
                        copyContent(ev, clientCode);
                      }}
                      variant={"outlined"}
                      className="small-button"
                      size={"small"}
                    >
                      Copy
                    </Button>
                    <Button
                      color={"secondary"}
                      onClick={() => {
                        downloadFile(
                          clientCode,
                          `${appSpec.contract.name}.client.ts`,
                        );
                      }}
                      variant={"outlined"}
                      className="small-button"
                      size={"small"}
                    >
                      Download
                    </Button>
                  </div>
                  <div>
                    {isClientCodeVisible ? (
                      <Dialog
                        onClose={() => {
                          setClientCodeVisibility(false);
                        }}
                        maxWidth={"md"}
                        open={isClientCodeVisible}
                        TransitionComponent={ModalGrowTransition}
                        className="classic-modal"
                      >
                        <DialogTitle>
                          <div>{`${appSpec.contract.name}.client.ts`}</div>
                          <div>
                            <Close
                              onClick={() => {
                                setClientCodeVisibility(false);
                              }}
                              className="close-modal"
                            />
                          </div>
                        </DialogTitle>
                        <DialogContent>
                          <div className="client-code-ts-wrapper">
                            <div className="client-code-ts-container">
                              <div className="source">
                                <CodeBlock
                                  text={clientCode}
                                  theme={github}
                                  language="typescript"
                                  showLineNumbers={true}
                                />
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                <div className="error-msg">unable to generate</div>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default ContractClient;
