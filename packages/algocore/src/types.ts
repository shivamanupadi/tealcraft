import { AlgodTokenHeader, CustomTokenHeader } from "algosdk";

export type AlgodConnectionParams = {
  url: string;
  port: string;
  token: string | AlgodTokenHeader | CustomTokenHeader;
};

export type NodeConnectionParams = {
  id: string;
  label: string;
  name: string;
  algod: AlgodConnectionParams;
};
