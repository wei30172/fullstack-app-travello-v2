/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com`,
      }
    ]
  },
  experimental: {
    esmExternals: "loose",
    serverComponentsExternalPackages: ["mongoose"]
  }
}

export default nextConfig
