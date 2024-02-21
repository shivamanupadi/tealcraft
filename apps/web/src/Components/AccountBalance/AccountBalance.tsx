import "./AccountBalance.scss";
import { ReactElement, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { microalgosToAlgos } from "algosdk";
import { AccountResult } from "@algorandfoundation/algokit-utils/types/indexer";
import { AccountClient, CoreAccount, CoreNode, Network } from "@repo/algocore";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { Explorer } from "@repo/algocore/src/explorer/explorer";
import Dispenser from "../Dispenser/Dispenser";
import { Tooltip } from "@mui/material";
import { ShowerOutlined } from "@mui/icons-material";

interface AccountBalanceProps {
  address: string;
}

function AccountBalance({ address }: AccountBalanceProps): ReactElement {
  const [account, setAccount] = useState<AccountResult | null>(null);
  const { selectedNode } = useSelector((state: RootState) => state.nodes);
  const { status, health, genesis, versionsCheck } = useSelector(
    (state: RootState) => state.node,
  );

  const coreNodeInstance = new CoreNode(status, versionsCheck, genesis, health);

  async function getAccountDetails() {
    if (selectedNode) {
      const network = new Network(selectedNode);
      const accountClient = new AccountClient(network);
      const account = await accountClient.getAccountInformation(address);
      setAccount(account);
    }
  }

  useEffect(() => {
    getAccountDetails();
  }, [selectedNode, address]);

  return (
    <div className={"account-balance-wrapper"}>
      <div
        className={"account-balance-container"}
        onClick={() => {
          new Explorer(coreNodeInstance).openAddress(address);
        }}
      >
        {account ? (
          <div className="account">
            <div className="bal">
              <NumericFormat
                value={microalgosToAlgos(new CoreAccount(account).balance())}
                displayType={"text"}
                thousandSeparator={true}
                prefix="BAL : "
              ></NumericFormat>
            </div>
            <div className="dispense hover">
              {selectedNode ? (
                <Dispenser
                  address={address}
                  network={new Network(selectedNode)}
                  onDispense={() => {
                    getAccountDetails();
                  }}
                >
                  <Tooltip title="Dispense Algos">
                    <ShowerOutlined></ShowerOutlined>
                  </Tooltip>
                </Dispenser>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default AccountBalance;
