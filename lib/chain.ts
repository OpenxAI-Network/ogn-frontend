import { mainnet, sepolia } from "viem/chains"

export const chain = process.env.NEXT_PUBLIC_USE_TESTNET ? sepolia : mainnet
