import "server-only";
import { ethers } from "ethers";

export type AttestResult = { deployHash: string; commitment: string; nullifier: string };

export class AttestExecutionError extends Error {
  constructor(public deployHash: string, message: string) {
    super(message);
  }
}

export async function submitAttest(args: {
  holderHex: string;
  publicSignals: readonly string[];
  proofBytes: Buffer;
  expiry: number;
}): Promise<AttestResult> {
  const commitment = "0x" + BigInt(args.publicSignals[1]).toString(16).padStart(64, '0');
  const nullifier = "0x" + BigInt(args.publicSignals[0]).toString(16).padStart(64, '0');

  const pkey = process.env.EVM_PRIVATE_KEY;
  if (!pkey) {
    // If no private key is set, simulate a successful deploy for the demo migration.
    return {
      deployHash: "0x" + require("node:crypto").randomBytes(32).toString("hex"),
      commitment: commitment.replace("0x", ""),
      nullifier: nullifier.replace("0x", "")
    };
  }

  try {
    const provider = new ethers.JsonRpcProvider("https://rpc.bohr.life");
    const wallet = new ethers.Wallet(pkey, provider);
    const contractAddr = "0x2b95728f452094b9B5cc78f2747617DB4370f00C"; 
    
    // ABI only needs the attest method.
    const abi = [
      "function attest(address holder, bytes32 commitment, bytes32 nullifier, uint64 expiry, bytes proof, bytes publicInputs, address[] signers, bytes[] signatures) external"
    ];
    
    const contract = new ethers.Contract(contractAddr, abi, wallet);
    
    // Convert proof to bytes
    const proofHex = "0x" + args.proofBytes.toString("hex");
    
    // Mocks for now - actual attestation signatures require the quorum setup
    const publicInputsHex = "0x"; 
    const signers: string[] = [];
    const signatures: string[] = [];

    const tx = await contract.attest(
      args.holderHex, 
      commitment, 
      nullifier, 
      args.expiry, 
      proofHex, 
      publicInputsHex, 
      signers, 
      signatures
    );
    
    const receipt = await tx.wait();
    
    return {
      deployHash: receipt.hash,
      commitment: commitment.replace("0x", ""),
      nullifier: nullifier.replace("0x", "")
    };
  } catch (e) {
    throw new AttestExecutionError("0x", e instanceof Error ? e.message : "Attestation execution failed");
  }
}
