"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import {
  cookieStorage,
  createStorage,
  fallback,
  http,
  WagmiProvider,
} from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"

import { siteConfig } from "@/config/site"
import { chain } from "@/lib/chain"

export const chains = [chain] as const
export const defaultChain = chain

const appName = siteConfig.name
const appDescription = siteConfig.description
const appIcon = "https://ogn.openxai.org/icon.png" as const
const appUrl = "https://ogn.openxai.org" as const
const metadata = {
  name: appName,
  description: appDescription,
  url: appUrl,
  icons: [appIcon],
}

const projectId = "d1f8b715ff4d735c6036c5ff6f4abe6a" as const // WalletConnect
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: fallback([
      http("https://eth.drpc.org"),
      http("https://eth.llamarpc.com"),
      http("https://rpc.ankr.com/eth"),
      http("https://cloudflare-eth.com"),
    ]),
    [sepolia.id]: http("https://sepolia.gateway.tenderly.co"),
  },
})

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
