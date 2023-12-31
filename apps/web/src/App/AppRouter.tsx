import { HashRouter } from "react-router-dom";
import { ReactElement } from "react";
import { Button } from "@mui/material";
import { A_AccountInformation, CoreAccount } from "@repo/algocore";

function AppRouter(): ReactElement {
  const test: A_AccountInformation = {
    "apps-total-schema": {
      "num-byte-slice": 0,
      "num-uint": 0,
    },
    participation: {
      "selection-participation-key": "",
      "state-proof-key": "",
      "vote-first-valid": 0,
      "vote-key-dilution": 0,
      "vote-last-valid": 0,
      "vote-participation-key": "",
    },
    "amount-without-pending-rewards": 0,
    "apps-local-state": [],
    "created-apps": [],
    "created-assets": [],
    "min-balance": 0,
    "pending-rewards": 0,
    "reward-base": 0,
    address: "",
    amount: 0,
    assets: [],
    rewards: 0,
    round: 0,
    status: "",
  };
  const y = new CoreAccount(test);
  console.log(y.balance());
  return (
    <div>
      <HashRouter>
        <div className="app-wrapper">
          <div className="app-container">hello world ! welcome</div>
          <Button variant={"contained"} color={"primary"}>
            click me
          </Button>
          <Button variant={"contained"} color={"secondary"}>
            click me
          </Button>
        </div>
      </HashRouter>
    </div>
  );
}

export default AppRouter;
