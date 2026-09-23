export const SITE = {
  name: "Vritz",
  domain: "Vritz.finance",
  url: "https://Vritz.finance",
  tagline: "Compliance that never touches investor PII.",
  description:
    "Vritz keeps a tokenized real-world asset compliant for life. Every holder is provably eligible, continuously re-screened, and blocked on-chain the moment they're not, while the issuer never touches a single piece of investor PII.",
  oneLiner:
    "Keep your tokenized asset compliant for life. Every holder is provably eligible, continuously re-screened, and blocked on-chain the moment they're not. Your firm never touches a single piece of investor PII.",
  github: "https://github.com/winsznx/Vritz",
  csprFans: "https://cspr.fans",
  explorer: "https://testnet.cspr.live",
} as const;

export const NAV_LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "GitHub", href: SITE.github, external: true },
] as const;

export const APP_SURFACES = [
  { key: "issuer", label: "Issuer", href: "/app/issuer", blurb: "Compliance control room" },
  { key: "investor", label: "Investor", href: "/app/investor", blurb: "Prove eligibility privately" },
  { key: "regulator", label: "Regulator", href: "/app/regulator", blurb: "Verify disclosures" },
] as const;

export type SurfaceKey = (typeof APP_SURFACES)[number]["key"];
