/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'upload.wikimedia.org',
      'assets.tokopedia.net',
      'technobusiness.id',
      'encrypted-tbn0.gstatic.com',
      'hips.hearstapps.com',
      'www.paper.id'
    ]
  }
}

module.exports = nextConfig
