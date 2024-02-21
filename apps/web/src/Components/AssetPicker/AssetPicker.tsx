import "./AssetPicker.scss";
import { useDispatch, useSelector } from "react-redux";
import { ReactElement, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AssetResult } from "@algorandfoundation/algokit-utils/types/indexer";
import { ModalGrowTransition, ShadedInput } from "@repo/theme";
import { debounce, isNumber } from "@repo/utils";
import { Network } from "@repo/algocore";
import { RootState } from "../../Redux/store";
import { AssetClient } from "@repo/algocore/src/clients/assetClient";
import { useSnackbar } from "@repo/ui";

interface AssetPickerProps {
  show: boolean;
  title?: string;
  onPick?: Function;
  onClose?: () => void;
}

function AssetPicker({
  show = false,
  title = "Search assets",
  onPick = () => {},
  onClose = () => {},
}: AssetPickerProps): ReactElement {
  const [searchText, setSearchText] = useState<string>("");
  const [searchBy, setSearchBy] = useState<string>("name");
  const [searching, setSearching] = useState<boolean>(false);
  const [assets, setAssets] = useState<AssetResult[]>([]);

  const { showException } = useSnackbar();

  const dispatch = useDispatch();
  const { selectedNode } = useSelector((state: RootState) => state.nodes);

  const clearState = () => {
    setSearchText("");
    setSearching(false);
    setSearchBy("name");
    setAssets([]);
  };

  useEffect(() => {
    async function search() {
      if (!selectedNode) {
        return;
      }

      const network = new Network(selectedNode);
      const assetClient = new AssetClient(network);
      try {
        setSearching(true);
        setAssets([]);
        let result: any;

        if (searchBy === "name") {
          result = await assetClient.searchForAssetsByName(searchText);
        } else if (searchBy === "id") {
          if (isNumber(searchText)) {
            result = await assetClient.searchForAssetsByIndex(
              Number(searchText),
            );
          } else {
            setSearching(false);
          }
        }

        if (result) {
          setSearching(false);
          setAssets(result.assets);
        }
      } catch (e: any) {
        showException(e);
        setSearching(false);
      }
    }

    if (searchText) {
      search();
    } else {
      setAssets([]);
    }
  }, [searchText, dispatch, searchBy]);

  function handleClose() {
    clearState();
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
          maxWidth={"xs"}
        >
          <DialogTitle>
            <div>{title}</div>
            <div>
              <CloseIcon
                className="modal-close-button hover"
                onClick={handleClose}
              />
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="asset-picker-wrapper">
              <div className="asset-picker-container">
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <ButtonGroup
                      variant="outlined"
                      color="primary"
                      size={"small"}
                    >
                      <Button
                        variant={searchBy === "name" ? "contained" : "outlined"}
                        onClick={() => {
                          setSearchBy("name");
                        }}
                      >
                        Asset Name
                      </Button>
                      <Button
                        variant={searchBy === "id" ? "contained" : "outlined"}
                        onClick={() => {
                          setSearchBy("id");
                        }}
                      >
                        Asset Id
                      </Button>
                    </ButtonGroup>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <ShadedInput
                      placeholder={
                        searchBy === "name" ? "Planet watch" : "87234773"
                      }
                      onChange={(ev) => {
                        debounce(() => {
                          setSearchText(ev.target.value);
                        }, 1000)();
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {searching ? (
                      <div className="searching">
                        <CircularProgress sx={{ marginTop: "100px" }} />
                        <div className="text">searching ...</div>
                      </div>
                    ) : (
                      <div>
                        {assets.length === 0 ? (
                          <div className="no-results">No results found</div>
                        ) : (
                          <div className="searched-assets">
                            {assets.map((asset) => {
                              return (
                                <div
                                  className="asset"
                                  key={asset.index}
                                  onClick={() => {
                                    onPick(asset);
                                    clearState();
                                  }}
                                >
                                  <span>{asset.params.name}</span>
                                  <div style={{ marginTop: "5px" }}>
                                    ID: {asset.index}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </Grid>
                </Grid>

                <div></div>
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

export default AssetPicker;
