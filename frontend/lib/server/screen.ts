/*
  SERVER-ONLY. Sanctions screening — honest scope:

  1. LIVE data source: the OFAC SDN digital-currency designations (ETH address list,
     mirrored by 0xB10C from the official SDN). Fetched live, versioned by content
     hash + timestamp.
  2. DEMO denylist: an EVM-account denylist (env DEMO_SANCTIONED_ACCOUNTS) used to
     demonstrate the on-chain revoke/deny path. Results are labeled accordingly.

  Fail-closed freshness: if the live list cannot be fetched and no sufficiently
  fresh cached copy exists, screening throws and NO attestation happens.
*/

import "server-only";
import { createHash } from "node:crypto";

const OFAC_LIST_URL =
  "https://raw.githubusercontent.com/0xB10C/ofac-sanctioned-digital-currency-addresses/lists/sanctioned_addresses_ETH.txt";

const REFRESH_MS = 3_600_000; // re-fetch after 1h
const MAX_STALE_MS = 24 * 3_600_000; // refuse to attest on data older than 24h

export class ScreeningUnavailableError extends Error {
  constructor(msg: string) {
    super(`sanctions screening unavailable — refusing to attest: ${msg}`);
    this.name = "ScreeningUnavailableError";
  }
}

type ListSnapshot = { set: Set<string>; fetchedAt: number; sha256: string };
let cache: ListSnapshot | null = null;

async function liveList(now: number = Date.now()): Promise<ListSnapshot> {
  if (cache && now - cache.fetchedAt < REFRESH_MS) return cache;
  try {
    const res = await fetch(OFAC_LIST_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`fetch failed: HTTP ${res.status}`);
    const text = await res.text();
    const set = new Set(text.split("\n").map((s) => s.trim().toLowerCase()).filter(Boolean));
    if (set.size === 0) throw new Error("empty list");
    cache = { set, fetchedAt: now, sha256: createHash("sha256").update(text).digest("hex") };
    return cache;
  } catch (e) {
    if (cache && now - cache.fetchedAt < MAX_STALE_MS) return cache; // degraded but < 24h old
    throw new ScreeningUnavailableError(e instanceof Error ? e.message : "fetch failed");
  }
}

function demoDenylist(): Set<string> {
  return new Set(
    (process.env.DEMO_SANCTIONED_ACCOUNTS ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export type ScreenResult = {
  clean: boolean;
  hit: null | { identifier: string; list: "ofac-sdn-eth" | "demo-evm-denylist" };
  screened: { ethAddress: string };
  meta: {
    source: string;
    url: string;
    fetchedAt: string;
    listSha256: string;
    entries: number;
    scope: string;
  };
};

export async function screenParties(args: {
  ethAddress: string;
}): Promise<ScreenResult> {
  const raw = String(args.ethAddress).trim().toLowerCase();
  if (!/^0x[0-9a-f]{40}$/.test(raw)) throw new Error("address must be 0x + 40 hex chars");
  const account = raw;

  const snapshot = await liveList();
  const meta = {
    source: "OFAC SDN digital-currency designations (ETH), 0xB10C mirror",
    url: OFAC_LIST_URL,
    fetchedAt: new Date(snapshot.fetchedAt).toISOString(),
    listSha256: snapshot.sha256,
    entries: snapshot.set.size,
    scope: "Live OFAC list matches exact EVM addresses. Demo list used for UI illustrations.",
  };

  if (snapshot.set.has(account)) {
    return { clean: false, hit: { identifier: account, list: "ofac-sdn-eth" }, screened: { ethAddress: account }, meta };
  }
  if (demoDenylist().has(account)) {
    return { clean: false, hit: { identifier: account, list: "demo-evm-denylist" }, screened: { ethAddress: account }, meta };
  }
  return { clean: true, hit: null, screened: { ethAddress: account }, meta };
}

export function _setScreenCache(snapshot: { set: Set<string>; fetchedAt: number; sha256: string } | null): void {
  cache = snapshot;
}
