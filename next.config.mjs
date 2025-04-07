/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (webpackConfig) => {
    // For web3modal
    webpackConfig.externals.push("pino-pretty", "lokijs", "encoding")
    return webpackConfig
  },
  images: {
    remotePatterns: [{ hostname: 'erc721.openxai.org'}],
  },
}

export default nextConfig
