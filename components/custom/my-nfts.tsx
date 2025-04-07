"use client"

import Image from "next/image"
import Link from "next/link"
import { GenesisNFTContract } from "@/contracts/GenesisNFT"
import { useAccount } from "wagmi"

import { chain } from "@/lib/chain"
import { useOwnedNfts } from "@/hooks/useGenesisNFTMinter"

import { Text, Title } from "../base"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

export function MyNfts() {
  const nfts = useOwnedNfts()

  return (
    <div className="flex flex-col gap-1">
      <Title>Your OpenxAI Genesis NFTs</Title>
      {nfts && nfts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 max-md:grid-cols-1">
          {nfts.map((nft, i) => {
            const tier = nft.tokenId.toString()[0]

            return (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>#{nft.tokenId.toString()}</CardTitle>
                  <CardDescription>Tier {tier}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex place-content-center">
                    <Image
                      alt={`Tier ${tier} OpenxAI Genesis NFT image`}
                      src={`https://erc721.openxai.org/image/ogn/tier${tier}.png`}
                      width={100}
                      height={100}
                    />
                  </div>
                </CardContent>
                <CardFooter className="max-md:place-content-center">
                  <Button asChild>
                    <Link
                      href={`${chain.blockExplorers.default.url}/nft/${GenesisNFTContract.address}/${nft.tokenId.toString()}`}
                      target="_blank"
                    >
                      View on Etherscan
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <Text>You do not own any OpenxAI Genesis NFTs.</Text>
      )}
    </div>
  )
}
