import { Contract, BrowserProvider, TransactionRequest, Signer } from "ethers";
import { ASSET_ID } from "./chain";

export const WRIT_TOKEN_ADDRESS = "0x2b95728f452094b9B5cc78f2747617DB4370f00C"; 

const WRIT_TOKEN_ABI = [
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function attest(address holder, bytes32 commitment, bytes32 nullifier, uint64 expiry, bytes proof, bytes publicInputs, address[] signers, bytes[] signatures) external",
  "function revoke(address holder) external",
  "function freeze(address holder, bytes32 reasonHash) external",
  "function unfreeze(address holder, bytes32 reasonHash) external",
];

export async function sendTransaction(
  provider: BrowserProvider,
  methodName: string,
  args: any[]
): Promise<string> {
  const signer = await provider.getSigner();
  const contract = new Contract(WRIT_TOKEN_ADDRESS, WRIT_TOKEN_ABI, signer);
  const tx = await contract[methodName](...args);
  const receipt = await tx.wait();
  return receipt.hash;
}
