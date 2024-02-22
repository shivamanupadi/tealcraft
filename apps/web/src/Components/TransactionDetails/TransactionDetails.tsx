import "./TransactionDetails.scss";

import React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { CheckCircleOutline, Close } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { CoreNode } from "@repo/algocore";
import { Explorer } from "@repo/algocore/src/explorer/explorer";
import { ModalGrowTransition } from "@repo/theme";

interface TransactionDetailsProps {
  show: boolean;
  onClose?: () => void;
  id: string;
  msg?: string;
}

function TransactionDetails({
  id,
  show,
  onClose,
  msg,
}: TransactionDetailsProps): JSX.Element {
  const { genesis, health, versionsCheck, status } = useSelector(
    (state: RootState) => state.node,
  );
  const coreNodeInstance = new CoreNode(status, versionsCheck, genesis, health);

  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  return (
    <div>
      {show ? (
        <Dialog
          onClose={handleClose}
          maxWidth={"xs"}
          open={show}
          TransitionComponent={ModalGrowTransition}
          transitionDuration={400}
          className="classic-modal"
        >
          <DialogTitle>
            <div></div>
            <div>
              <Close onClick={handleClose} className="close-modal" />
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="transaction-details-wrapper">
              <div className="transaction-details-container">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="txn">
                      <div>
                        <CheckCircleOutline
                          fontSize={"large"}
                          className="success-icon"
                        ></CheckCircleOutline>
                      </div>
                      <div className="name">Transaction successful</div>
                      {msg ? <div className="msg">{msg}</div> : ""}
                      <div className="id">{id}</div>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div style={{ marginTop: 20, marginBottom: 30 }}>
                      <Button
                        color={"primary"}
                        variant={"contained"}
                        className="green-button"
                        size={"large"}
                        onClick={() => {
                          new Explorer(coreNodeInstance).openTransaction(id);
                        }}
                      >
                        View transaction
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        ""
      )}
    </div>
  );
}

export default TransactionDetails;
