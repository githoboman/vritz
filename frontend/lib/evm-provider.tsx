"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { BrowserProvider, Signer } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface EVMContextValue {
  ready: boolean;
  account: { address: string } | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  getSigner: () => Promise<Signer>;
}

const EVMContext = createContext<EVMContextValue | null>(null);

export function EVMProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    setReady(typeof window !== "undefined" && !!window.ethereum);
    
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          setAddress(null);
        }
      });
      
      // Check if already connected
      window.ethereum.request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) setAddress(accounts[0]);
        })
        .catch(console.error);
    }
  }, []);

  const connect = async () => {
    if (!window.ethereum) throw new Error("No EVM wallet found");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    if (accounts.length > 0) {
      setAddress(accounts[0]);
    }
  };

  const disconnect = () => {
    setAddress(null);
  };

  const getSigner = async () => {
    if (!window.ethereum) throw new Error("No EVM wallet found");
    const provider = new BrowserProvider(window.ethereum);
    return await provider.getSigner();
  };

  const signMessage = async (message: string) => {
    const signer = await getSigner();
    return await signer.signMessage(message);
  };

  const account = address ? { address } : null;

  return (
    <EVMContext.Provider value={{ ready, account, connect, disconnect, signMessage, getSigner }}>
      {children}
    </EVMContext.Provider>
  );
}

export function useEVM(): EVMContextValue {
  const ctx = useContext(EVMContext);
  if (!ctx) throw new Error("useEVM must be used within EVMProvider");
  return ctx;
}
