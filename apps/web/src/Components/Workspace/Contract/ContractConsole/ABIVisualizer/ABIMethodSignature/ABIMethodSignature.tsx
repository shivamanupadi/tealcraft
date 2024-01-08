import "./ABIMethodSignature.scss";
import { ReactElement, useState } from "react";
import { Button, ButtonGroup } from "@mui/material";
import { ABIMethodParams, ABIMethod } from "algosdk";
import { TEXT_ENCODING } from "@repo/algocore";

type ABIMethodProps = {
  method: ABIMethodParams;
};

function ABIMethodSignature({ method }: ABIMethodProps): ReactElement {
  const abiMethodInstance = new ABIMethod(method);

  const [encoding, setEncoding] = useState<string>("hex");

  return (
    <div className={"abi-method-signature-wrapper"}>
      <div className={"abi-method-signature-container"}>
        <div className="method-signature">
          <div>
            <div className="method-sig-section">
              <div className="method-sig-section-key">Signature</div>
              <div className="method-sig-section-value break">
                {abiMethodInstance.getSignature()}
              </div>
            </div>

            <div className="method-sig-section">
              <div className="method-sig-section-key">Description</div>
              <div className="method-sig-section-value break">
                {abiMethodInstance.description || "--Empty--"}
              </div>
            </div>

            <div className="method-sig-section">
              <div className="method-sig-section-key">Returns</div>
              <div className="method-sig-section-value break">
                <div>{abiMethodInstance.returns.type.toString()}</div>
                <div style={{ marginTop: "5px" }}>
                  {abiMethodInstance.returns.description}
                </div>
              </div>
            </div>

            <div className="method-sig-section">
              <div className="method-sig-section-key">Transactions</div>
              <div className="method-sig-section-value break">
                {abiMethodInstance.txnCount()}
              </div>
            </div>

            <div className="method-sig-section">
              <div className="method-sig-section-key">
                <div>Selector</div>
                <div>
                  <ButtonGroup color="primary" variant="outlined">
                    <Button
                      size="small"
                      className="small-button"
                      variant={
                        encoding === TEXT_ENCODING.HEX
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => {
                        setEncoding(TEXT_ENCODING.HEX);
                      }}
                    >
                      HEX
                    </Button>
                    <Button
                      size="small"
                      className="small-button"
                      variant={
                        encoding === TEXT_ENCODING.BASE64
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => {
                        setEncoding(TEXT_ENCODING.BASE64);
                      }}
                    >
                      BASE64
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
              <div className="method-sig-section-value">
                {encoding === TEXT_ENCODING.HEX
                  ? Buffer.from(abiMethodInstance.getSelector()).toString("hex")
                  : ""}
                {encoding === TEXT_ENCODING.BASE64
                  ? Buffer.from(abiMethodInstance.getSelector()).toString(
                      "base64",
                    )
                  : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ABIMethodSignature;
