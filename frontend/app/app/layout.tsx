import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { EVMProvider } from "@/lib/evm-provider";

export const metadata: Metadata = {
  title: "App",
  robots: { index: false, follow: false },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EVMProvider>
      <AppShell>{children}</AppShell>
    </EVMProvider>
  );
}
