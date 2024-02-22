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
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AssetResult } from "@algorandfoundation/algokit-utils/types/indexer";
import {
  encodeTransactionNote,
  mnemonicAccount,
  sendTransaction,
} from "@algorandfoundation/algokit-utils";
import { ModalGrowTransition, ShadedInput } from "@repo/theme";
import { debounce, isNumber } from "@repo/utils";
import { Network } from "@repo/algocore";
import { RootState } from "../../Redux/store";
import { AssetClient } from "@repo/algocore/src/clients/assetClient";
import { useLoader, useSnackbar } from "@repo/ui";
import {
  makeAssetCreateTxnWithSuggestedParams,
  SuggestedParams,
} from "algosdk";

interface AssetPickerProps {
  show: boolean;
  title?: string;
  onPick?: Function;
  onClose?: () => void;
}

const decimalsList: number[] = Array.from({ length: 11 }, (_, i) => i);

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

  const [tab, setTab] = useState<string>("search");

  const [name, setName] = useState<string>("");
  const [unit, setUnit] = useState<string>("");
  const [supply, setSupply] = useState<string>("");
  const [decimals, setDecimals] = useState<string>("0");

  const { showException, showSnack } = useSnackbar();
  const { showLoader, hideLoader } = useLoader();
  const dispatch = useDispatch();
  const { selectedNode } = useSelector((state: RootState) => state.nodes);
  const { selectedAccount } = useSelector((state: RootState) => state.accounts);

  const clearState = () => {
    setSearchText("");
    setSearching(false);
    setSearchBy("name");
    setAssets([]);
    setName("");
    setUnit("");
    setSupply("");
    setDecimals("0");
    setTab("search");
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
                <Tabs
                  value={tab}
                  orientation="horizontal"
                  variant={"fullWidth"}
                  indicatorColor={"secondary"}
                  textColor="secondary"
                  className="asset-tabs"
                >
                  <Tab
                    label="Search"
                    value="search"
                    onClick={() => {
                      setTab("search");
                    }}
                  />
                  <Tab
                    label="Create"
                    value="create"
                    onClick={() => {
                      setTab("create");
                    }}
                  />
                </Tabs>

                <div className="tab-content">
                  {tab === "search" ? (
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <ButtonGroup
                          variant="outlined"
                          color="primary"
                          size={"small"}
                        >
                          <Button
                            variant={
                              searchBy === "name" ? "contained" : "outlined"
                            }
                            onClick={() => {
                              setSearchBy("name");
                            }}
                          >
                            Asset Name
                          </Button>
                          <Button
                            variant={
                              searchBy === "id" ? "contained" : "outlined"
                            }
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
                  ) : (
                    ""
                  )}

                  {tab === "create" ? (
                    <div>
                      <form
                        onSubmit={async (event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FormLabel className="classic-label">
                              Asset name
                            </FormLabel>
                            <ShadedInput
                              autoFocus
                              value={name}
                              onChange={(ev: any) => {
                                setName(ev.target.value);
                              }}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FormLabel className="classic-label">
                              Unit name
                            </FormLabel>
                            <ShadedInput
                              value={unit}
                              onChange={(ev: any) => {
                                setUnit(ev.target.value);
                              }}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FormLabel className="classic-label">
                              Total supply
                            </FormLabel>
                            <ShadedInput
                              value={supply}
                              onChange={(ev: any) => {
                                setSupply(ev.target.value);
                              }}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <FormLabel className="classic-label">
                              Decimals
                            </FormLabel>
                            <Select
                              value={decimals}
                              onChange={(ev) => {
                                setDecimals(ev.target.value);
                              }}
                              fullWidth
                              color={"primary"}
                              className="classic-select"
                            >
                              {decimalsList.map((dec) => {
                                return (
                                  <MenuItem value={dec} key={dec}>
                                    {dec}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </Grid>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div className="create-actions">
                              <div>
                                <Button
                                  size={"large"}
                                  color={"primary"}
                                  variant={"contained"}
                                  onClick={async () => {
                                    if (!selectedNode) {
                                      return;
                                    }
                                    if (!selectedAccount) {
                                      return;
                                    }
                                    if (!name) {
                                      showSnack("Invalid name", "error");
                                      return;
                                    }
                                    if (!unit) {
                                      showSnack("Invalid unit name", "error");
                                      return;
                                    }
                                    if (!supply) {
                                      showSnack(
                                        "Invalid total supply",
                                        "error",
                                      );
                                      return;
                                    }
                                    if (!isNumber(supply)) {
                                      showSnack(
                                        "Total supply should be a number",
                                        "error",
                                      );
                                      return;
                                    }
                                    try {
                                      showLoader("Creating asset ...");

                                      const network = new Network(selectedNode);
                                      const algod = network.getAlgodClient();

                                      const suggestedParams: SuggestedParams =
                                        await algod.getTransactionParams().do();

                                      const note = encodeTransactionNote(
                                        "create asset from tealcraft",
                                      );

                                      const account = mnemonicAccount(
                                        selectedAccount.mnemonic,
                                      );
                                      const unsignedTxn =
                                        makeAssetCreateTxnWithSuggestedParams(
                                          account.addr,
                                          note,
                                          BigInt(supply),
                                          Number(decimals),
                                          false,
                                          account.addr,
                                          account.addr,
                                          account.addr,
                                          account.addr,
                                          unit,
                                          name,
                                          undefined,
                                          undefined,
                                          suggestedParams,
                                          undefined,
                                        );

                                      if (unsignedTxn) {
                                        const result = await sendTransaction(
                                          {
                                            from: account,
                                            transaction: unsignedTxn,
                                          },
                                          algod,
                                        );

                                        if (result.confirmation?.assetIndex) {
                                          const newAsset = await algod
                                            .getAssetByID(
                                              Number(
                                                result.confirmation.assetIndex,
                                              ),
                                            )
                                            .do();
                                          onPick(newAsset);
                                          clearState();
                                        }
                                      }

                                      hideLoader();
                                    } catch (e) {
                                      showException(e);
                                    }
                                  }}
                                >
                                  Create
                                </Button>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </form>
                    </div>
                  ) : (
                    ""
                  )}
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

export default AssetPicker;
