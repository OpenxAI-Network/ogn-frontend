import Image from "next/image"
import Link from "next/link"

import { siteConfig } from "@/config/site"

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center border-b bg-black">
      <Link href="/" className="ml-2 flex items-center space-x-2">
        <Image
          alt="Logo"
          src="/icon.png"
          width={35}
          height={35}
          priority={true}
        />
        <span className="inline-block text-xl font-bold text-white">
          {siteConfig.name}
        </span>
      </Link>
      <div className="grow" />
      <div className="mr-2">
        <w3m-button />
      </div>
    </header>
  )
}
