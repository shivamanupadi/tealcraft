export type ContractFiddleParams = {
  id: number;
  name: string;
  source: string;
  frameworkId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateContractFiddleParams = {
  name: string;
  source: string;
  frameworkId: string;
};
