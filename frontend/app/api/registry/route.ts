/*
  Live registry view — SERVER-SIDE route. Holds the BOT.cloud key (process.env,
  from .env.local) and calls BOT.cloud server-side; the browser fetches THIS endpoint
  and never sees the key. Returns the live roster + attribution trail for the v3
  registry + challenge contracts.
*/

import { fetchRegistryView } from "@/lib/cspr-cloud";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  try {
    const view = await fetchRegistryView("dummy");
    return Response.json(view, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "BOT.cloud read failed" },
      { status: 502 },
    );
  }
}
