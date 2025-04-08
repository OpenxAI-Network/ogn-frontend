import React from "react"
import { GenesisNFTContract } from "@/contracts/GenesisNFT"

import { chain } from "@/lib/chain"
import { GenesisNFTMinterAddress } from "@/hooks/useGenesisNFTMinter"
import { Link, Text, Title } from "@/components/base"
import { MyNfts } from "@/components/custom/my-nfts"
import { Participate } from "@/components/custom/participate"

export default function IndexPage() {
  return (
    <section className="container inset-x-0 mb-6 grid items-center gap-3">
      <Title>OpenxAI Protocol</Title>
      <Text>
        Open Permissionless AI Ecosystem
        <br />
        Your AI. Your Rules. No Middlemen.
      </Text>
      <div className="flex flex-col">
        <Title>TGE & Public Sale</Title>
        <Text>Date: May 2025</Text>
        <Text>TGE Price: $0.15</Text>
        <Text>Marketcap (CS): $120,000</Text>
        <Text>FDV (Public): $14M</Text>
      </div>
      <Title>OpenxAI Genesis</Title>
      <Text>
        Thank you for believing in our vision to build a permissionless AI
        protocol, making AI accessible to everyone. The OpenxAI Genesis is an
        exclusive invite for 50 early backers to join our mission, securing a
        discounted $OPENX allocation.
      </Text>
      <table className="my-3 w-full">
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
          <td>Minting Contract</td>
          <td className="break-all">
            <Link
              href={`${chain.blockExplorers.default.url}/address/${GenesisNFTMinterAddress}`}
            >
              {GenesisNFTMinterAddress}
            </Link>
          </td>
        </tr>
        <tr>
          <td>Participation Proof (ERC721 NFT)</td>
          <td className="break-all">
            <Link
              href={`${chain.blockExplorers.default.url}/token/${GenesisNFTContract.address}`}
            >
              {GenesisNFTContract.address}
            </Link>
          </td>
        </tr>
      </table>
      <Participate />
      <MyNfts />
    </section>
  )
}
