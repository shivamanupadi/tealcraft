import React, { ReactElement } from "react";
import "./CodeViewer.scss";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Close } from "@mui/icons-material";
import { ModalGrowTransition } from "@repo/theme";
import { copyContent, downloadFile } from "@repo/utils";
import { CodeBlock, github } from "react-code-blocks";

interface CodeViewerProps {
  show: boolean;
  onClose: () => void;
  code: any;
  title: string;
  fileName: string;
  language: string;
}

function CodeViewer({
  show,
  onClose,
  code,
  title,
  fileName,
  language,
}: CodeViewerProps): ReactElement {
  function handleClose() {
    onClose();
  }

  return (
    <div>
      {show ? (
        <Dialog
          onClose={handleClose}
          fullWidth
          open={show}
          TransitionComponent={ModalGrowTransition}
          transitionDuration={400}
          className="classic-modal"
        >
          <DialogTitle>
            <div>{title}</div>
            <div>
              <Close onClick={handleClose} className="close-modal" />
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="code-viewer-wrapper">
              <div className="code-viewer-container">
                <div className="code-actions">
                  <div>
                    <Button
                      color={"secondary"}
                      onClick={(ev) => {
                        copyContent(ev, code);
                      }}
                      variant={"outlined"}
                      size={"small"}
                    >
                      Copy
                    </Button>
                  </div>
                  <div>
                    <Button
                      color={"primary"}
                      onClick={() => {
                        downloadFile(code, fileName);
                      }}
                      variant={"outlined"}
                      size={"small"}
                    >
                      Download
                    </Button>
                  </div>
                </div>
                <div className="code-content">
                  <div className="source">
                    <CodeBlock
                      text={code}
                      theme={github}
                      language={language}
                      showLineNumbers={true}
                    />
                  </div>
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

export default CodeViewer;
