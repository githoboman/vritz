/*
  SERVER-ONLY. Mandatory wallet-control binding for onboarding.

  The server issues a single-use nonce; the visitor signs a domain-separated message
  (chain, registry, asset, account, nonce, expiry) with the wallet that owns the
  account being onboarded. Verification is BLOCKING.

  Store is in-memory (single Railway replica).
*/

import "server-only";
import { randomBytes } from "node:crypto";
import { verifyMessage } from "ethers";

const BIND_TTL_MS = 10 * 60_000;
const MAX_PENDING = 5_000;

const CHAIN = process.env.NEXT_PUBLIC_BOT_CHAIN_ID ?? "968";
const REGISTRY = process.env.REGISTRY_PKG ?? "0x0000000000000000000000000000000000000000";
const ASSET = process.env.ASSET_ID ?? "Vritz-bond-001";

type BindRecord = {
  account: string;
  nonce: string;
  expiresAtMs: number;
  consumed: boolean;
};

const records = new Map<string, BindRecord>();

function prune(): void {
  const now = Date.now();
  for (const [k, r] of records) if (r.consumed || r.expiresAtMs < now) records.delete(k);
}

export function bindMessage(account: string, nonce: string, expiresAtMs: number): string {
  return [
    "Vritz onboarding bind v2",
    `chain: ${CHAIN}`,
    `registry: ${REGISTRY}`,
    `asset: ${ASSET}`,
    `account: ${account}`,
    `nonce: ${nonce}`,
    `expires: ${Math.floor(expiresAtMs / 1000)}`,
  ].join("\n");
}

/** Issue a fresh single-use bind nonce for an account. */
export function issueBindNonce(account: string): { nonce: string; message: string; expiresAtMs: number } {
  prune();
  if (records.size >= MAX_PENDING) throw new Error("bind store full — try again shortly");
  const nonce = randomBytes(16).toString("hex");
  const expiresAtMs = Date.now() + BIND_TTL_MS;
  records.set(nonce, { account, nonce, expiresAtMs, consumed: false });
  return { nonce, message: bindMessage(account, nonce, expiresAtMs), expiresAtMs };
}

export type BindFailure =
  | "missing-fields"
  | "unknown-nonce"
  | "expired"
  | "replayed"
  | "account-mismatch"
  | "bad-signature";

export type BindVerification = { ok: true } | { ok: false; reason: BindFailure };

/**
 * BLOCKING verification that the caller controls `account`. Checks: nonce exists,
 * unexpired, unconsumed, issued for this account; the signature verifies over the exact issued message
 * and recovers to the `account` address.
 */
export function verifyBindStrict(args: {
  account: unknown;
  publicKey?: unknown; // unused in EVM but kept for API compatibility
  nonce: unknown;
  signature: unknown;
  consume: boolean;
}): BindVerification {
  const { account, nonce, signature } = args;
  if (
    typeof account !== "string" ||
    typeof nonce !== "string" || typeof signature !== "string" ||
    !account || !nonce || !signature
  ) {
    return { ok: false, reason: "missing-fields" };
  }
  const rec = records.get(nonce);
  if (!rec) return { ok: false, reason: "unknown-nonce" };
  if (rec.expiresAtMs < Date.now()) return { ok: false, reason: "expired" };
  if (rec.consumed) return { ok: false, reason: "replayed" };
  if (rec.account.toLowerCase() !== account.toLowerCase()) return { ok: false, reason: "account-mismatch" };
  
  const message = bindMessage(rec.account, rec.nonce, rec.expiresAtMs);
  
  try {
    const recovered = verifyMessage(message, signature);
    if (recovered.toLowerCase() !== account.toLowerCase()) {
      return { ok: false, reason: "bad-signature" };
    }
  } catch (e) {
    return { ok: false, reason: "bad-signature" };
  }
  
  if (args.consume) rec.consumed = true;
  return { ok: true };
}

/** Test hook — clears the nonce store. */
export function _resetBindStore(): void {
  records.clear();
}
