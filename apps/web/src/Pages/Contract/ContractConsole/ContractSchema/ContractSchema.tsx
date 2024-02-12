import "./ContractSchema.scss";
import { ReactElement } from "react";
import {
  Alert,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const tableStyles = {
  width: "100%",
  borderRadius: "5px",
  boxShadow: "none !important",
  border: `1px solid ${GreyColors.E6E7E8}`,
  th: {
    fontSize: "14px",
    background: GreyColors.E6E7E8,
    color: GreyColors.FormLabel,
  },
  td: {
    color: GreyColors.FormLabel,
  },
  "th, td": {
    fontSize: "14px",
    padding: "5px 10px",
    borderColor: GreyColors.E6E7E8,
  },
};

import { GreyColors } from "@repo/theme";
import {
  Schema,
  StateSchema,
} from "@algorandfoundation/algokit-utils/types/app-spec";

export interface ContractSchemaProps {
  title: string;
  storage: StateSchema;
  schema: Schema;
}

function ContractSchema({
  title,
  storage,
  schema,
}: ContractSchemaProps): ReactElement {
  const { declared, reserved } = schema;
  const items = [...Object.keys(declared), ...Object.keys(reserved)];

  return (
    <div className={"contract-schema-wrapper"}>
      <div className={"contract-schema-container"}>
        <div className="contract-schema-header">
          <div className="title">{title}</div>
          <div>
            <Alert
              icon={false}
              color={"success"}
              className="mini-alert primary-light-alert"
            >
              Bytes: {storage.num_byte_slices}
            </Alert>

            <Alert
              icon={false}
              color={"warning"}
              className="mini-alert secondary-light-alert"
              sx={{ marginLeft: "10px" }}
            >
              Uints: {storage.num_uints}
            </Alert>
          </div>
        </div>
        {items.length > 0 ? (
          <div className="contract-schema-body">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="arguments">
                  <TableContainer component={Paper} sx={tableStyles}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Key</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Variant</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.keys(declared).map((key) => {
                          const row = declared[key];

                          return (
                            <TableRow
                              key={`global_key_${key}`}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell>{row?.key}</TableCell>
                              <TableCell>{row?.type}</TableCell>
                              <TableCell>
                                <div>Declared</div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                        {Object.keys(reserved).map((key) => {
                          const row = reserved[key];

                          return (
                            <TableRow
                              key={`global_key_${key}`}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell></TableCell>
                              <TableCell>{row?.type}</TableCell>
                              <TableCell>{row?.descr}</TableCell>
                              <TableCell>
                                <div>Reserved</div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Grid>
            </Grid>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ContractSchema;
