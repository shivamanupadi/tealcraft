import "./ABIMethod.scss";
import React, { ReactElement } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { ABIMethodParams, ABIMethod as ABIMethodSDK } from "algosdk";
import ABIMethodSignature from "../ABIMethodSignature/ABIMethodSignature";
import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import { getMethodCallConfig, isCreateMethod } from "@repo/algocore";
import { tableStyles } from "../../ContractSchema/ContractSchema";
import { GreyColors, ThemeColors } from "@repo/theme";

type ABIMethodProps = {
  method: ABIMethodParams;
  appSpec: AppSpec;
};

function ABIMethod({ method, appSpec }: ABIMethodProps): ReactElement {
  const abiMethodInstance = new ABIMethodSDK(method);
  const args = abiMethodInstance.args;

  const callConfig = getMethodCallConfig(method, appSpec);

  return (
    <div className={"abi-method-wrapper"}>
      <div className={"abi-method-container"}>
        <div className="abi-method">
          <Accordion className="accordion">
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: GreyColors.A7A9AC }} />}
            >
              <div className="method-header">
                <div className="method-name">{abiMethodInstance.name}</div>
                <div>
                  {isCreateMethod(method, appSpec) ? (
                    <div>
                      <Tooltip title="Creation method">
                        <div
                          className="cm-method"
                          style={{ color: ThemeColors.Secondary }}
                        >
                          CM
                        </div>
                      </Tooltip>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="method-body">
                <div className="method-signature">
                  <ABIMethodSignature method={method}></ABIMethodSignature>
                </div>

                <div className="method-section">
                  <div className="method-section-title">Arguments</div>
                  <div className="method-section-value">
                    {args.length > 0 ? (
                      <TableContainer component={Paper} sx={tableStyles}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Type</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {args.map((arg, index) => (
                              <TableRow key={`${arg.name}-method-arg-${index}`}>
                                <TableCell>{arg.name}</TableCell>
                                <TableCell>{arg.type.toString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <div className="empty">--Empty--</div>
                    )}
                  </div>
                </div>

                <div className="method-section">
                  <div className="method-section-title">Call configuration</div>
                  <div className="method-section-value">
                    {callConfig && Object.keys(callConfig).length > 0 ? (
                      <TableContainer component={Paper} sx={tableStyles}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Config</TableCell>
                              <TableCell>Value</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>no_op</TableCell>
                              <TableCell>{callConfig.no_op}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>close_out</TableCell>
                              <TableCell>{callConfig.close_out}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>opt_in</TableCell>
                              <TableCell>{callConfig.opt_in}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>delete_application</TableCell>
                              <TableCell>
                                {callConfig.delete_application}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>update_application</TableCell>
                              <TableCell>
                                {callConfig.update_application}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <div className="empty">--Empty--</div>
                    )}
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default ABIMethod;
