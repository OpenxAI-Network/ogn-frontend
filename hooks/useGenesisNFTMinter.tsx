import { GenesisNFTContract } from "@/contracts/GenesisNFT"
import { GenesisNFTMinterContract } from "@/contracts/GenesisNFTMinter"
import { useQuery } from "@tanstack/react-query"
import { Alchemy, Network } from "alchemy-sdk"
import { zeroAddress } from "viem"
import { useAccount, useReadContracts } from "wagmi"

import { chain } from "@/lib/chain"

export const GenesisNFTMinterAddress =
  chain.id === 1
    ? ("0x7BEA4ec96E931a901808907748F9678589048689" as const)
    : ("0x67d09fFa416CA1711e2cebE1C724C76fa77836df" as const)
export const StableCoinAddress =
  chain.id === 1
    ? ("0xdAC17F958D2ee523a2206206994597C13D831ec7" as const)
    : ("0xC69258C33cCFD5d2F862CAE48D4F869Db59Abc6A" as const)

export function useTiers() {
  const { data: tiers } = useReadContracts({
    contracts: [
      {
        address: GenesisNFTMinterAddress,
        abi: GenesisNFTMinterContract.abi,
        functionName: "tiers",
        args: [BigInt(0)],
      },
      {
        address: GenesisNFTMinterAddress,
        abi: GenesisNFTMinterContract.abi,
        functionName: "tiers",
        args: [BigInt(1)],
      },
      {
        address: GenesisNFTMinterAddress,
        abi: GenesisNFTMinterContract.abi,
        functionName: "tiers",
        args: [BigInt(2)],
      },
    ],
    allowFailure: false,
  })

  return tiers?.map((tier) => {
    return {
      currentlyMinted: tier[0],
      maxMinted: tier[1],
      tierPrefix: tier[2],
      stableCoinsPerNft: tier[3],
    }
  })
}

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: chain.id === 1 ? Network.ETH_MAINNET : Network.ETH_SEPOLIA,
})
export function useOwnedNfts() {
  const { address } = useAccount()

  const { data: nfts } = useQuery({
    queryKey: ["nfts", address ?? zeroAddress],
    enabled: !!address,
    queryFn: async () => {
      if (!address) return undefined

      return await alchemy.nft
        .getNftsForOwner(address, {
          contractAddresses: [GenesisNFTContract.address],
          omitMetadata: true,
        })
        .then((res) => res.ownedNfts)
        .then((ownedNfts) =>
          ownedNfts.map((n) => {
            return { tokenId: BigInt(n.tokenId) }
          })
        )
    },
    staleTime: 10 * 1000,
  })

  return nfts
}
