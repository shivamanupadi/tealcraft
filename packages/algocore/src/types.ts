import { ABIContractParams, BoxReference } from "algosdk";

export type A_AccountInformation = {
  address: string;
  amount: number;
  "min-balance": number;
  "amount-without-pending-rewards": number;
  "apps-local-state": A_AppsLocalState[];
  "apps-total-schema": A_AppsTotalSchema;
  assets: A_AssetHolding[];
  "created-apps": A_Application[];
  "created-assets": A_Asset[];
  "pending-rewards": number;
  "reward-base": number;
  rewards: number;
  round: number;
  status: string;
  "auth-addr"?: string;
  participation?: A_AccountParticipation;
};

export type A_AccountParticipation = {
  "selection-participation-key": string;
  "state-proof-key": string;
  "vote-first-valid": number;
  "vote-key-dilution": number;
  "vote-last-valid": number;
  "vote-participation-key": string;
};
export type A_Application = {
  id: number;
  params: A_ApplicationParams;
};

export type A_GlobalState = {
  key: string;
  value: {
    bytes: string;
    type: number;
    uint: number;
  };
};

export type A_ApplicationParams = {
  "approval-program": string;
  "clear-state-program": string;
  creator: string;
  "global-state"?: A_GlobalState[];
  "global-state-schema": A_StateSchema;
  "local-state-schema": A_StateSchema;
};

export type A_AssetHolding = {
  amount: number;
  "asset-id": number;
  creator: string;
  "is-frozen": boolean;
};

export type A_AppsTotalSchema = {
  "num-byte-slice": number;
  "num-uint": number;
};

export type A_StateSchema = {
  "num-byte-slice": number;
  "num-uint": number;
};

export type A_AppsLocalState = {
  id: number;
  "key-value": {
    key: string;
    value: {
      bytes: string;
      type: number;
      uint: number;
    };
  }[];
  schema: A_StateSchema;
};

export type A_SearchTransaction = {
  "close-rewards": number;
  "closing-amount": number;
  "confirmed-round": number;
  fee: number;
  "first-valid": number;
  "intra-round-offset": number;
  "last-valid": number;
  "receiver-rewards": number;
  "round-time": number;
  sender: string;
  "sender-rewards": number;
  "tx-type": string;
  note: string;
  "genesis-hash": string;
  "genesis-id": string;
  id: string;
  group?: string;
  "inner-txns"?: A_SearchTransactionInner[];
  "created-application-index"?: number;
  "created-asset-index"?: number;
  "application-transaction"?: A_SearchTransaction_App_Call_Payload;
  "asset-transfer-transaction"?: A_SearchTransaction_Asset_Transfer_Payload;
  "asset-freeze-transaction"?: A_SearchTransaction_Asset_Freeze_Payload;
  "payment-transaction"?: A_SearchTransaction_Payment_Payload;
  "asset-config-transaction"?: A_Asset;
  "keyreg-transaction"?: A_SearchTransaction_KeyReg_Payload;
  "state-proof-transaction"?: A_SearchTransaction_State_Proof_Payload;
  "global-state-delta"?: A_GlobalStateDelta[];
  "local-state-delta"?: A_LocalStateDelta[];
  signature: A_SearchTransaction_Signature;
  logs?: string[];
  boxes?: BoxReference[];
  "rekey-to"?: string;
};

export type A_SearchTransactionInner = Omit<
  A_SearchTransaction,
  "id,note,genesis-hash,genesis-id,inner-txns"
>;

export type A_GlobalStateDelta = {
  key: string;
  value: {
    bytes: string;
    action: number;
    uint: number;
  };
};
export type A_AppStateDelta = {
  key: string;
  value: {
    bytes: string;
    action: number;
    uint: number;
  };
};
export type A_LocalStateDelta = {
  address: string;
  delta: A_AppStateDelta[];
};

export type A_Asset = {
  index: number;
  params: A_AssetParams;
};

export type A_AssetParams = {
  clawback?: string;
  creator: string;
  decimals: number;
  "default-frozen": boolean;
  freeze?: string;
  manager?: string;
  name: string;
  "name-b64": string;
  reserve?: string;
  total: number;
  "unit-name": string;
  "unit-name-b64": string;
  url?: string;
  "url-b64"?: string;
  "metadata-hash"?: string;
};

export type A_SearchTransaction_Signature = {
  multisig?: {
    version: number;
    threshold: number;
    subsignature: {
      "public-key": string;
      signature: string;
    }[];
  };
  logicsig?: {
    logic: string;
  };
  sig?: string;
};

export type A_SearchTransaction_KeyReg_Payload = {
  "non-participation": boolean;
  "selection-participation-key": string;
  "vote-first-valid": number;
  "vote-key-dilution": number;
  "vote-last-valid": number;
  "vote-participation-key": string;
};

export type A_SearchTransaction_Payment_Payload = {
  amount: number;
  "close-amount": number;
  receiver: string;
  "close-remainder-to": string;
};

export type A_SearchTransaction_Asset_Transfer_Payload = {
  amount: number;
  "asset-id": number;
  "close-amount": number;
  receiver: string;
  "close-to": string;
};

export type A_SearchTransaction_Asset_Freeze_Payload = {
  address: string;
  "asset-id": number;
  "new-freeze-status": boolean;
};
export type A_SearchTransaction_App_Call_Payload = {
  accounts: string[];
  "application-args": string[];
  "application-id": number;
  "approval-program": string;
  "clear-state-program": string;
  "foreign-apps": number[];
  "foreign-assets": number[];
  "global-state-schema": A_StateSchema;
  "local-state-schema": A_StateSchema;
  "on-completion": string;
};

export type A_StateProof = {
  "part-proofs": A_PartProofs;
  "positions-to-reveal": number[];
  reveals: A_Reveal[];
  "salt-version": number;
  "sig-commit": string;
  "sig-proofs": A_SigProofs;
  "signed-weight": number;
};

export type A_PartProofs = {
  "hash-factory": A_HashFactory;
  path: string[];
  "tree-depth": number;
};

export type A_HashFactory = {
  "hash-type": number;
};

export type A_Reveal = {
  participant: A_Participant;
  position: number;
  "sig-slot": A_SigSlot;
};

export type A_Participant = {
  verifier: A_Verifier;
  weight: number;
};

export type A_Verifier = {
  commitment: string;
  "key-lifetime": number;
};

export type A_SigSlot = {
  "lower-sig-weight": number;
  signature: A_Signature;
};

export type A_Signature = {
  "falcon-signature": string;
  "merkle-array-index": number;
  proof: A_Proof;
  "verifying-key": string;
};

export type A_Proof = {
  "hash-factory": A_HashFactory;
  path: string[];
  "tree-depth": number;
};

export type A_SigProofs = {
  "hash-factory": A_HashFactory;
  path: string[];
  "tree-depth": number;
};

export type A_SearchTransaction_State_Proof_Payload = {
  message: A_Message;
  "state-proof": A_StateProof;
  "state-proof-type": number;
};

export type A_Message = {
  "block-headers-commitment": string;
  "first-attested-round": number;
  "latest-attested-round": number;
  "ln-proven-weight": number;
  "voters-commitment": string;
};

export interface A_ApplicationSpecParams {
  source: {
    approval: string;
    clear: string;
  };
  contract: ABIContractParams;
  state: A_ApplicationSpecState;
  schema: A_ApplicationSpecSchema;
  hints: A_ApplicationSpecHints;
}

export type A_ApplicationSpecState = {
  local: A_ApplicationSpecStateStorage;
  global: A_ApplicationSpecStateStorage;
};

export type A_ApplicationSpecStateStorage = {
  num_byte_slices: number;
  num_uints: number;
};

export type A_ApplicationSpecSchema = {
  local: A_ApplicationSpecSchemaValue;
  global: A_ApplicationSpecSchemaValue;
};

export type A_ApplicationSpecSchemaValue = {
  declared: Record<string, A_ApplicationSpecSchemaDetails>;
  reserved: Record<string, A_ApplicationSpecSchemaDetails>;
};

export type A_ApplicationSpecSchemaDetails = {
  type: string;
  key: string;
  descr: string;
};

export type A_ApplicationSpecHints = Record<string, A_ApplicationSpecHint>;

export type A_ApplicationSpecHint = {
  default_arguments: A_ApplicationSpecHintDefaultArguments;
  call_config: {
    no_op: string;
  };
};

export type A_ApplicationSpecHintDefaultArguments = Record<
  string,
  A_ApplicationSpecHintDefaultArgument
>;

export type A_ApplicationSpecHintDefaultArgument = {
  source: string;
  data: string;
};

export type A_ApplicationSpecHintDefaultArgumentValue = {
  name: string;
  value: string;
};
