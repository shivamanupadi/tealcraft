import "./AccountBalance.scss";
import { ReactElement, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { microalgosToAlgos } from "algosdk";
import { AccountResult } from "@algorandfoundation/algokit-utils/types/indexer";
import { AccountClient, CoreAccount, Network } from "@repo/algocore";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

interface AccountBalanceProps {
  address: string;
}

function AccountBalance({ address }: AccountBalanceProps): ReactElement {
  const [account, setAccount] = useState<AccountResult | null>(null);
  const { selectedNode } = useSelector((state: RootState) => state.nodes);

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
      <div className={"account-balance-container"}>
        {account ? (
          <NumericFormat
            value={microalgosToAlgos(new CoreAccount(account).balance())}
            displayType={"text"}
            thousandSeparator={true}
            prefix="BAL : "
          ></NumericFormat>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default AccountBalance;
