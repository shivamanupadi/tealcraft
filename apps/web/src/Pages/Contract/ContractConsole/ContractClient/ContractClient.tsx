import React, { ReactElement, useState } from "react";
import "./ContractClient.scss";
import { Button } from "@mui/material";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";

import { useLoader, useSnackbar } from "@repo/ui";
import { TSClient } from "@repo/tealcraft-sdk/src/TSClient/TSClient";
import CodeViewer from "../../../../Components/CodeViewer/CodeViewer";

export type ContractAppSpecProps = {
  appSpec: AppSpec;
};

function ContractClient({ appSpec }: ContractAppSpecProps): ReactElement {
  const { showLoader, hideLoader } = useLoader();
  const { showException } = useSnackbar();
  const [clientCode, setClientCode] = useState<string>("");
  const [isClientCodeVisible, setClientCodeVisibility] =
    useState<boolean>(false);

  function generateClient(appSpec: AppSpec) {
    showLoader("Generating typescript client code ...");
    setTimeout(() => {
      hideLoader();

      try {
        showLoader("Generating typescript client code ...");
        const clientCode = new TSClient().generate(appSpec);
        setClientCode(clientCode);
        setClientCodeVisibility(true);
        hideLoader();
      } catch (e) {
        hideLoader();
        showException(e);
      }
    }, 100);
  }

  return (
    <div className="contract-client-wrapper">
      <div className="contract-client-container">
        <div className="client-body">
          <div className="client-code-details">
            <div className="client-code">Client code generation</div>
            <div className="client-code-desc">
              Generates a type-safe smart contract client in TypeScript. It does
              this by reading an ARC-32 application spec and generating a client
              which exposes methods for each ABI method in the target smart
              contract, along with helpers to create, update, and delete the
              application.
            </div>
            <div className="client-code-actions">
              <div>
                <Button
                  color={"primary"}
                  onClick={() => {
                    generateClient(appSpec);
                  }}
                  variant={"contained"}
                  size={"small"}
                >
                  Generate
                </Button>
                <CodeViewer
                  show={isClientCodeVisible}
                  onClose={() => {
                    setClientCodeVisibility(false);
                  }}
                  code={clientCode}
                  title="TS client code"
                  fileName={`${appSpec.contract.name}.client.ts`}
                  language="typescript"
                ></CodeViewer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractClient;
