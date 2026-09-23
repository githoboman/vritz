export const CHAIN = {
  name: "botchain-testnet",
  node: "https://rpc.bohr.life",
  explorer: "https://scan.botchain.ai",
} as const;

export const ASSET_ID = "0x2b95728f452094b9B5cc78f2747617DB4370f00C"; // WritToken on BOT Chain testnet

export const OFFICER_MULTISIG = "0x1111111111111111111111111111111111111111"; // Mock deployer for EVM

export const DEPLOYER = "0x1111111111111111111111111111111111111111"; // Mock deployer for EVM

export const REGULATED_HOLDER = {
  holder: "0x1111111111111111111111111111111111111111",
  commitment: "0x02279cc98f1b933e33ec83b0da410fe85f64b9d088c4f097b08e75d63cc69125",
} as const;

export function accountUrl(accountHash: string): string {
  return `${CHAIN.explorer}/address/${accountHash}`;
}

export function deployTxUrl(deployHash: string): string {
  return `${CHAIN.explorer}/tx/${deployHash}`;
}

export function deployUrl(deployHash: string): string {
  return `${CHAIN.explorer}/address/${deployHash}`;
}

export const CONTRACTS = {
  cep78: { contract: "0x1111111111111111111111111111111111111111", pkg: "0x1111111111111111111111111111111111111111" },
  registry: { contract: "0x1111111111111111111111111111111111111111", pkg: "0x1111111111111111111111111111111111111111" },
  verifier: { contract: "0x1111111111111111111111111111111111111111", pkg: "0x1111111111111111111111111111111111111111" },
  challenge: { contract: "0x1111111111111111111111111111111111111111", pkg: "0x1111111111111111111111111111111111111111" },
  filter: { contract: "0x1111111111111111111111111111111111111111", pkg: "0x1111111111111111111111111111111111111111" },
  filterToken: { contract: "0x1111111111111111111111111111111111111111", pkg: "0x1111111111111111111111111111111111111111" },
  token: { contract: "0x1111111111111111111111111111111111111111", pkg: "0x1111111111111111111111111111111111111111" }
};

