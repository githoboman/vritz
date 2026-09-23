import type { Metadata } from "next";
import Link from "next/link";
import { DocArticle, Contract } from "@/components/docs";
import { CONTRACTS } from "@/lib/chain";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Architecture" };

export default function DocsArchitecture() {
  return (
    <DocArticle
      slug="architecture"
      title="Architecture overview"
      description="Six contracts, each with one job, live on botchain-testnet."
    >
      <ul className="space-y-2.5 text-[15px]">
        <Contract pkg={CONTRACTS.registry.pkg} name="Credential Registry" job="per-holder credential (commitment, nullifier, status, bonded signer set); attest, revoke, officer actions, role grant/revoke/renounce." />
        <Contract pkg={CONTRACTS.verifier.pkg} name="Groth16 Verifier" job="on-chain pairing verification — used only by the fraud-challenge path." />
        <Contract pkg={CONTRACTS.challenge.pkg} name="Challenge" job="economic fraud disputes: bond, challenge, resolve → slash + treasury transfer, withdraw." />
        <Contract pkg={CONTRACTS.filter.pkg} name="Transfer Filter" job="the recipient-aware EVM hook — checks sender and recipient are live; fail-safe deny." />
        <Contract pkg={CONTRACTS.cep78.pkg} name="Vritz EVM Token" job="the RWA bond token (real EVM smart contract), wired to the filter and mint-gated." />
        <Contract pkg={CONTRACTS.token.pkg} name="Vritz Token" job="the Vritz-token and its EVM transfer filter." />
      </ul>
      <p className="text-sm text-ink-subtle">
        The full system design, data flow, and trust model are in{" "}
        <Link href={`${SITE.github}/blob/main/ARCHITECTURE.md`} target="_blank" rel="noreferrer" className="text-brand underline-offset-2 hover:underline">
          ARCHITECTURE.md
        </Link>
        ; the closed attack surface and test coverage in{" "}
        <Link href={`${SITE.github}/blob/main/ADVERSARIAL_TESTING.md`} target="_blank" rel="noreferrer" className="text-brand underline-offset-2 hover:underline">
          ADVERSARIAL_TESTING.md
        </Link>
        .
      </p>
    </DocArticle>
  );
}
