"use client";

import { MetaMaskProvider } from "@metamask/sdk-react";
import { ReactNode } from "react";

interface MetaMaskProviderWrapperProps {
  children: ReactNode;
}

export const MetaMaskProviderWrapper = ({
  children,
}: MetaMaskProviderWrapperProps) => {
  const host =
    typeof window !== "undefined" ? window.location.host : "localhost:3000";

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Next-Metamask-Boilerplate",
      url: host,
    },
  };

  return (
    <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
      {children}
    </MetaMaskProvider>
  );
};
