"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { GenesisNFTMinterContract } from "@/contracts/GenesisNFTMinter"
import { useQueryClient } from "@tanstack/react-query"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { erc20Abi, formatUnits, parseAbi, zeroAddress } from "viem"
import { useAccount, useReadContract } from "wagmi"

import { chain } from "@/lib/chain"
import { cn } from "@/lib/utils"
import {
  GenesisNFTMinterAddress,
  StableCoinAddress,
  useTiers,
} from "@/hooks/useGenesisNFTMinter"
import { usePerformTransaction } from "@/hooks/usePerformTransaction"

import { Subtitle, Text, Title } from "../base"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Input } from "../ui/input"

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

export function Participate() {
  const { address } = useAccount()
  const { open } = useWeb3Modal()
  const tierData = useTiers()
  const { performTransaction, performingTransaction } = usePerformTransaction({
    chainId: chain.id,
  })
  const queryClient = useQueryClient()

  const [tierAmount, setTierAmount] = useState<number[]>([0, 0, 0])

  const usdtRequired = useMemo(() => {
    if (!tierData) {
      return BigInt(0)
    }

    return (
      BigInt(isNaN(tierAmount[0]) ? 0 : tierAmount[0]) *
        tierData[0].stableCoinsPerNft +
      BigInt(isNaN(tierAmount[1]) ? 0 : tierAmount[1]) *
        tierData[1].stableCoinsPerNft +
      BigInt(isNaN(tierAmount[2]) ? 0 : tierAmount[2]) *
        tierData[2].stableCoinsPerNft
    )
  }, [tierData, tierAmount])

  const { data: usdtBalance } = useReadContract({
    abi: erc20Abi,
    address: StableCoinAddress,
    functionName: "balanceOf",
    args: [address ?? zeroAddress],
    query: {
      enabled: !!address,
    },
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: erc20Abi,
    address: StableCoinAddress,
    functionName: "allowance",
    args: [address ?? zeroAddress, GenesisNFTMinterAddress],
    query: {
      enabled: !!address,
    },
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
          {tiers.map((tier, i) => (
            <Card className="rounded-3xl bg-gray-300/20" key={i}>
              <CardHeader className="flex-row gap-2 place-items-center">
                <Image
                  className="aspect-square grow-0 shrink-0 w-16 h-16"
                  alt={`Tier ${3 - i} OpenxAI NFT`}
                  src={`https://erc721.openxai.org/image/ogn/tier${3 - i}.png`}
                  width={64}
                  height={64}
                />
                <CardTitle>
                  OpenxAI Genesis ({Math.round(tier.stableCoins / 1000)}K)
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                <Text className="text-lg text-black/90">
                  Price: {tier.stableCoins.toLocaleString("en-us")} USDT
                </Text>
                <Text className="text-lg text-black/90">
                  Network: Ethereum Mainnet
                </Text>
                <Text className="text-lg text-black/90">
                  {tier.discount} Discount
                </Text>
                <Text className="text-lg text-black/90">
                  Token Price: {tier.tokenPrice}
                </Text>
              </CardContent>
              <CardFooter className="flex-col gap-2 items-start">
                <TierAmountSelector
                  tier={3 - i}
                  value={tierAmount[2 - i]}
                  setValue={(amount) =>
                    setTierAmount(
                      tierAmount.map((t, j) => (j === 2 - i ? amount : t))
                    )
                  }
                  tierData={tierData}
                  disabled={performingTransaction}
                />
                {tierData && (
                  <Text>
                    {tierData[2 - i].maxMinted -
                      tierData[2 - i].currentlyMinted}{" "}
                    Left
                  </Text>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <Subtitle>Legend</Subtitle>
        <div className="flex place-items-center gap-2">
          <div className="size-3.5 rounded-full bg-red-500" />
          <span>Already claimed</span>
        </div>
        <div className="flex place-items-center gap-2">
          <div className="size-3.5 rounded-full bg-orange-500" />
          <span>Currently selected</span>
        </div>
        <div className="flex place-items-center gap-2">
          <div className="size-3.5 rounded-full bg-green-500" />
          <span>Available for selection</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-semibold">
          USDT required: {formatUnits(usdtRequired, 6)}
        </span>
        {usdtBalance !== undefined && (
          <span
            className={cn(
              "text-sm",
              usdtRequired > usdtBalance && "text-red-500"
            )}
          >
            {formatUnits(usdtBalance, 6)} available
          </span>
        )}
      </div>
      {allowance !== undefined && allowance < usdtRequired && (
        <Button
          className="max-w-60"
          onClick={() => {
            if (!address) {
              open()
              return
            }

            performTransaction({
              transactionName: "Approve USDT spending",
              transaction: async () => {
                return {
                  abi: parseAbi([
                    "function approve(address spender, uint256 amount)",
                  ]),
                  address: StableCoinAddress,
                  functionName: "approve",
                  args: [GenesisNFTMinterAddress, usdtRequired],
                }
              },
              onConfirmed() {
                refetchAllowance()
              },
            })
          }}
          disabled={performingTransaction}
        >
          Approve USDT spending
        </Button>
      )}
      <Button
        className="max-w-60"
        onClick={() => {
          if (!address) {
            open()
            return
          }

          performTransaction({
            transactionName: "Mint OpenxAI Genesis NFTs",
            transaction: async () => {
              return {
                abi: GenesisNFTMinterContract.abi,
                address: GenesisNFTMinterAddress,
                functionName: "mint",
                args: [tierAmount],
              }
            },
            onConfirmed() {
              setTierAmount([0, 0, 0])
              queryClient.invalidateQueries({ queryKey: ["nfts"] })
              queryClient.invalidateQueries({
                queryKey: [GenesisNFTMinterAddress],
              })
            },
          })
        }}
        disabled={
          (allowance !== undefined && allowance < usdtRequired) ||
          usdtRequired === BigInt(0) ||
          performingTransaction
        }
      >
        Participate
      </Button>
    </div>
  )
}

function TierAmountSelector({
  tier,
  value,
  setValue,
  tierData,
  disabled,
}: {
  tier: number
  value: number
  setValue: (number: number) => void
  tierData: ReturnType<typeof useTiers>
  disabled: boolean
}) {
  const myTierData = tierData?.at(tier - 1)

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex place-items-center gap-2 place-content-between">
        <Text className="shrink-0 font-semibold text-lg">Participate</Text>
        <Input
          className="max-w-20"
          type="number"
          step="1"
          min="0"
          max={
            myTierData
              ? myTierData.maxMinted - myTierData.currentlyMinted
              : undefined
          }
          value={value}
          onChange={(e) => {
            let value = parseInt(e.target.value)
            if (
              myTierData &&
              value > myTierData.maxMinted - myTierData.currentlyMinted
            ) {
              value = myTierData.maxMinted - myTierData.currentlyMinted
            }
            setValue(value)
          }}
          disabled={disabled}
        />
      </div>
      {myTierData && (
        <div className="flex flex-wrap gap-1">
          {new Array(myTierData.maxMinted).fill(0).map((_, i) => (
            <div
              className={cn(
                "size-3.5 rounded-full",
                myTierData.currentlyMinted > i
                  ? "bg-red-500"
                  : myTierData.currentlyMinted + value > i
                    ? "bg-orange-500"
                    : "bg-green-500"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
