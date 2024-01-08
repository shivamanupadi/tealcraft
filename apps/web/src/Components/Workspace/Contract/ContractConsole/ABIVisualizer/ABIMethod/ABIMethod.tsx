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
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { ABIMethodParams, ABIMethod as ABIMethodSDK } from "algosdk";
import ABIMethodSignature from "../ABIMethodSignature/ABIMethodSignature";
import { GreyColors, theme } from "@repo/theme";

export const tableStyles = {
  width: "100%",
  borderRadius: "5px",
  boxShadow: "none !important",
  border: `1px solid ${theme.palette.grey[100]}`,
  th: {
    fontSize: "14px",
    background: theme.palette.grey[100],
    color: GreyColors.FormValue,
  },
  td: {
    color: GreyColors.FormLabel,
  },
  "th, td": {
    fontSize: "14px",
    padding: "5px 10px",
    borderColor: theme.palette.grey[100],
  },
};

type ABIMethodProps = {
  method: ABIMethodParams;
};

function ABIMethod({ method }: ABIMethodProps): ReactElement {
  const abiMethodInstance = new ABIMethodSDK(method);
  const args = abiMethodInstance.args;

  return (
    <div className={"abi-method-wrapper"}>
      <div className={"abi-method-container"}>
        <div className="abi-method">
          <Accordion className="accordion">
            <AccordionSummary expandIcon={<ExpandMore />}>
              <div className="method-header">
                <div className="method-name">{abiMethodInstance.name}</div>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="method-body">
                <div className="method-signature">
                  <ABIMethodSignature method={method}></ABIMethodSignature>
                </div>

                <div className="method-arguments">
                  <div className="arguments-title">Arguments</div>
                  <div className="arguments-value">
                    {args.length > 0 ? (
                      <TableContainer component={Paper} sx={tableStyles}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell>Description</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {args.map((arg, index) => (
                              <TableRow key={`${arg.name}-method-arg-${index}`}>
                                <TableCell>{arg.name}</TableCell>
                                <TableCell>{arg.type.toString()}</TableCell>
                                <TableCell>{arg.description}</TableCell>
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
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default ABIMethod;
