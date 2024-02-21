import { ReactElement, ReactNode } from "react";
import "./Dispenser.scss";
import {
  encodeTransactionNote,
  getDispenserAccount,
  sendTransaction,
} from "@algorandfoundation/algokit-utils";
import { CoreNode, Network } from "@repo/algocore";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useLoader, useSnackbar } from "@repo/ui";
import {
  SuggestedParams,
  algosToMicroalgos,
  makePaymentTxnWithSuggestedParams,
} from "algosdk";
import { Explorer } from "@repo/algocore/src/explorer/explorer";

interface DispenserProps {
  address: string;
  children: ReactNode;
  network: Network;
  onDispense: () => void;
}

function Dispenser({
  address,
  children,
  network,
  onDispense,
}: DispenserProps): ReactElement {
  const { showSnack, showException } = useSnackbar();
  const { showLoader, hideLoader } = useLoader();
  const { status, health, genesis, versionsCheck } = useSelector(
    (state: RootState) => state.node,
  );

  const coreNodeInstance = new CoreNode(status, versionsCheck, genesis, health);

  async function dispense() {
    if (!coreNodeInstance.isSandbox()) {
      new Explorer(coreNodeInstance).openDispenser();
      return;
    }

    try {
      showLoader("Dispensing Algos ...");
      const algod = network.getAlgodClient();
      const kmd = network.getKmdClient();
      const dispenserAccount = await getDispenserAccount(algod, kmd);

      const suggestedParams: SuggestedParams = await algod
        .getTransactionParams()
        .do();

      const amount = 100;
      const amountInMicros = algosToMicroalgos(Number(amount));
      const note = encodeTransactionNote("Dispencing algos from dispenser");

      const unsignedTxn = makePaymentTxnWithSuggestedParams(
        dispenserAccount.addr,
        address,
        amountInMicros,
        undefined,
        note,
        suggestedParams,
        undefined,
      );

      await sendTransaction(
        { from: dispenserAccount, transaction: unsignedTxn },
        algod,
      );
      onDispense();
      showSnack(`${amount} Algos dispenced to ${address}`, "success");
      hideLoader();
    } catch (e) {
      hideLoader();
      showException(e);
    }
  }

  return (
    <div
      className="dispenser-wrapper"
      onClick={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        dispense();
      }}
    >
      <div className="dispenser-container">{children}</div>
    </div>
  );
}

export default Dispenser;
