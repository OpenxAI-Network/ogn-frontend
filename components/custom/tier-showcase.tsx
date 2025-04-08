"use client"

import { useState } from "react"

import { useTiers } from "@/hooks/useGenesisNFTMinter"

import { Text, Title } from "../base"

interface Tier {
  stableCoins: number
  discount: string
  tokenPrice: string
}

export function TiersShowcase() {
  const tierData = useTiers()

  const tiers = [
    {
      stableCoins: 10_000,
      discount: "20%",
      tokenPrice: "$0.12",
    },
    {
      stableCoins: 25_000,
      discount: "33%",
      tokenPrice: "$0.10",
    },
    {
      stableCoins: 50_000,
      discount: "50%",
      tokenPrice: "$0.07",
    },
  ]

  return (
    <div>
      {tiers.map((tier, i) => (
        <div key={i} className="flex flex-col">
          <Title>${tier.stableCoins.toLocaleString("en-us")}</Title>
          <Text className="text-xl">{tier.discount} Discount</Text>
          <Text>OpenxAI Genesis ({Math.round(tier.stableCoins / 1000)}K)</Text>
          <Text className="text-black/70">Token Price: {tier.tokenPrice}</Text>
          {tierData && (
            <Text>
              {tierData[2 - i].maxMinted - tierData[2 - i].currentlyMinted} Left
            </Text>
          )}
        </div>
      ))}
    </div>
  )
}
