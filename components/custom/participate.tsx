"use client"

import { useMemo, useState } from "react"
import { GenesisNFTMinterContract } from "@/contracts/GenesisNFTMinter"
import { useQueryClient } from "@tanstack/react-query"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { erc20Abi, formatUnits, zeroAddress } from "viem"
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
import { Input } from "../ui/input"

export function Participate() {
  const { address } = useAccount()
  const { open } = useWeb3Modal()
  const tierData = useTiers()
  const { performTransaction, performingTransaction } = usePerformTransaction({
    chainId: chain.id,
  })
  const queryClient = useQueryClient()

  const [tier3Amount, setTier3Amount] = useState<number>(0)
  const [tier2Amount, setTier2Amount] = useState<number>(0)
  const [tier1Amount, setTier1Amount] = useState<number>(0)

  const usdtRequired = useMemo(() => {
    if (!tierData) {
      return BigInt(0)
    }

    return (
      BigInt(isNaN(tier1Amount) ? 0 : tier1Amount) *
        tierData[0].stableCoinsPerNft +
      BigInt(isNaN(tier2Amount) ? 0 : tier2Amount) *
        tierData[1].stableCoinsPerNft +
      BigInt(isNaN(tier3Amount) ? 0 : tier3Amount) *
        tierData[2].stableCoinsPerNft
    )
  }, [tierData, tier1Amount, tier2Amount, tier3Amount])

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
        <Title>Participate</Title>
        <div className="flex flex-col gap-2">
          <TierAmountSelector
            tier={3}
            value={tier3Amount}
            setValue={setTier3Amount}
            tierData={tierData}
            disabled={performingTransaction}
          />
          <TierAmountSelector
            tier={2}
            value={tier2Amount}
            setValue={setTier2Amount}
            tierData={tierData}
            disabled={performingTransaction}
          />
          <TierAmountSelector
            tier={1}
            value={tier1Amount}
            setValue={setTier1Amount}
            tierData={tierData}
            disabled={performingTransaction}
          />
        </div>
      </div>
      <div>
        <Subtitle>Legend</Subtitle>
        <div className="flex place-items-center gap-2">
          <div className="size-4 rounded-full bg-red-500" />
          <span>Already claimed</span>
        </div>
        <div className="flex place-items-center gap-2">
          <div className="size-4 rounded-full bg-orange-500" />
          <span>Currently selected</span>
        </div>
        <div className="flex place-items-center gap-2">
          <div className="size-4 rounded-full bg-green-500" />
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
              transaction: async () => {
                return {
                  abi: erc20Abi,
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
            transaction: async () => {
              return {
                abi: GenesisNFTMinterContract.abi,
                address: GenesisNFTMinterAddress,
                functionName: "mint",
                args: [[tier1Amount, tier2Amount, tier3Amount]],
              }
            },
            onConfirmed() {
              setTier1Amount(0)
              setTier2Amount(0)
              setTier3Amount(0)
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
    <div className="flex flex-col gap-1">
      <div className="flex place-items-center gap-2">
        <Text className="shrink-0">
          OpenxAI Genesis{" "}
          {tier === 3
            ? "(10K)"
            : tier === 2
              ? "(25K)"
              : tier === 1
                ? "(50K)"
                : ""}{" "}
          NFT x
        </Text>
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
                "size-4 rounded-full",
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
