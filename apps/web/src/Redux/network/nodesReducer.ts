import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { NodeConnectionParams } from "@repo/algocore";
import { TealCraft } from "@repo/tealcraft-sdk";

export function getNodes(): NodeConnectionParams[] {
  return [
    {
      id: "localnet",
      label: "Localnet",
      name: "localnet",
      algod: {
        url: "http://localhost",
        port: "4001",
        token:
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
    },
    {
      id: "algonode_mainnet",
      label: "Mainnet",
      name: "mainnet",
      algod: {
        url: "https://mainnet-api.algonode.cloud",
        port: "",
        token: "",
      },
    },
    {
      id: "algonode_testnet",
      label: "Testnet",
      name: "testnet",
      algod: {
        url: "https://testnet-api.algonode.cloud",
        port: "",
        token: "",
      },
    },
    {
      id: "algonode_betanet",
      label: "Betanet",
      name: "betanet",
      algod: {
        url: "https://betanet-api.algonode.cloud",
        port: "",
        token: "",
      },
    },
    {
      id: "nodly_voinet",
      label: "Voinet",
      name: "testnet",
      algod: {
        url: "https://testnet-api.voi.nodly.io",
        port: "",
        token: "",
      },
    },
  ];
}

export interface NodesReducer {
  nodes: NodeConnectionParams[];
  selectedNode?: NodeConnectionParams;
}

const initialState: NodesReducer = {
  nodes: [],
  selectedNode: undefined,
};

export const loadNodes: AsyncThunk<NodeConnectionParams[], void, {}> =
  createAsyncThunk("nodes/loadNodes", async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    dispatch(loadSelectedNode());
    return getNodes();
  });

export const loadSelectedNode: AsyncThunk<
  NodeConnectionParams | undefined,
  void,
  {}
> = createAsyncThunk("nodes/loadSelectedNode", async () => {
  const availableNodes = getNodes();

  const selectedNodeId = new TealCraft().getNodeId();

  return availableNodes.find((node) => node.id === selectedNodeId);
});

export const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      loadNodes.fulfilled,
      (state, action: PayloadAction<NodeConnectionParams[]>) => {
        if (action.payload) {
          state.nodes = action.payload;
        }
      },
    );
    builder.addCase(
      loadSelectedNode.fulfilled,
      (state, action: PayloadAction<NodeConnectionParams | undefined>) => {
        if (action.payload) {
          state.selectedNode = action.payload;
        }
      },
    );
  },
});

export default nodesSlice.reducer;
