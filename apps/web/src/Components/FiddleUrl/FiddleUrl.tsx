import { ReactElement } from "react";
import "./FiddleUrl.scss";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Close } from "@mui/icons-material";
import { ModalGrowTransition } from "@repo/theme";
import { copyContent } from "@repo/utils";

interface CreateContractProps {
  show: boolean;
  onClose: () => void;
  url: string;
}

function FiddleUrl({ show, onClose, url }: CreateContractProps): ReactElement {
  function handleClose() {
    onClose();
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
            <div>Public URL</div>
            <div>
              <Close onClick={handleClose} className="close-modal" />
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="fiddle-url-wrapper">
              <div className="fiddle-url-container">
                <div
                  className="url hover"
                  onClick={() => {
                    window.open(url, "_blank");
                  }}
                >
                  {url}
                </div>
                <div className="actions">
                  <Button
                    variant={"outlined"}
                    color="primary"
                    onClick={(ev) => {
                      copyContent(ev, url);
                    }}
                  >
                    Copy URL
                  </Button>
                </div>
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

export default FiddleUrl;
