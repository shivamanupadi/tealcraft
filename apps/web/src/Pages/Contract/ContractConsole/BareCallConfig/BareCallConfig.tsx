import "./BareCallConfig.scss";
import { ReactElement } from "react";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { AppSpec } from "@algorandfoundation/algokit-utils/types/app-spec";
import { tableStyles } from "../ContractSchema/ContractSchema";

export interface BareCallConfigProps {
  appSpec: AppSpec;
}

function BareCallConfig({ appSpec }: BareCallConfigProps): ReactElement {
  const { bare_call_config } = appSpec;

  return (
    <div className={"bare-call-config-wrapper"}>
      <div className={"bare-call-config-container"}>
        <div className="bare-call-config-header">
          <div className="title">Bare call config</div>
        </div>
        <div className="bare-call-config-body">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="arguments">
                <TableContainer component={Paper} sx={tableStyles}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Call</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>opt_in</TableCell>
                        <TableCell>{bare_call_config.opt_in}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>no_op</TableCell>
                        <TableCell>{bare_call_config.no_op}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>update_application</TableCell>
                        <TableCell>
                          {bare_call_config.update_application}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>delete_application</TableCell>
                        <TableCell>
                          {bare_call_config.delete_application}
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>close_out</TableCell>
                        <TableCell>{bare_call_config.close_out}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default BareCallConfig;
