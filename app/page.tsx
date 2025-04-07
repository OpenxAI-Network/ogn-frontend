import React from "react"

import { chain } from "@/lib/chain"
import { GenesisNFTMinterAddress } from "@/hooks/useGenesisNFTMinter"
import { Link, Text, Title } from "@/components/base"
import { MyNfts } from "@/components/custom/my-nfts"
import { Participate } from "@/components/custom/participate"
import { TiersShowcase } from "@/components/custom/tier-showcase"

export default function IndexPage() {
  return (
    <section className="container inset-x-0 mb-6 grid items-center gap-3">
      <Title>OpenxAI Genesis</Title>
      <Text>
        Thank you for believing in our vision to build a permissionless AI
        protocol, making AI accessible to everyone. The OpenxAI Genesis is an
        exclusive invite for 50 early backers to join our mission, securing a
        discounted $OPENX allocation.
      </Text>
      <TiersShowcase />
      <div className="flex flex-col">
        <Title>TGE & Public Sale</Title>
        <Text>Date: May 2025</Text>
        <Text>TGE Price: $0.15</Text>
        <Text>Marketcap (CS): $120,000</Text>
        <Text>FDV (Public): $14M</Text>
      </div>
      <table className="mt-6 w-full">
        <tr>
          <td>Whitelisting</td>
          <td>11:59 PM UTC, April 8, 2025 - 11:59 PM UTC, April 14, 2025</td>
        </tr>
        <tr>
          <td>Payment and Confirmation Phase</td>
          <td>11:59 PM UTC, April 8, 2025 - 11:59 PM UTC, April 20, 2025</td>
        </tr>
        <tr>
          <td>Accepted Payment Methods</td>
          <td>USDT ERC20 (Ethereum Mainnet)</td>
        </tr>
        <tr>
          <td>Vesting</td>
          <td>
            6 Months (linear)
            <br />
            10% unlock at TGE
          </td>
        </tr>
        <tr>
          <td>Contract Address</td>
          <td className="break-all">
            <Link
              href={`${chain.blockExplorers.default.url}/address/${GenesisNFTMinterAddress}`}
            >
              {GenesisNFTMinterAddress}
            </Link>
          </td>
        </tr>
      </table>
      <Participate />
      <MyNfts />
    </section>
  )
}
