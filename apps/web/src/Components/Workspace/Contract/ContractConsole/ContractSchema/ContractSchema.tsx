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

const tableStyles = {
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

import {
  A_ApplicationSpecSchemaValue,
  A_ApplicationSpecStateStorage,
} from "@repo/algocore";
import { GreyColors, theme } from "@repo/theme";

export interface ContractSchemaProps {
  title: string;
  storage: A_ApplicationSpecStateStorage;
  schema: A_ApplicationSpecSchemaValue;
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
                          <TableCell>Description</TableCell>
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
                              <TableCell>{row?.descr}</TableCell>
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
                              <TableCell>{row?.key}</TableCell>
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
