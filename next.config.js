/** @type {import('next').NextConfig} */
const basePath = process.env.GITHUB_ACTIONS ? '/Echo' : ''

const nextConfig = {
  agentRules: false,
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
