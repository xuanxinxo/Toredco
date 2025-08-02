/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'media-blog.jobsgo.vn',
      'thanhnien.vn',
      'images2.thanhnien.vn',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },



};

module.exports = nextConfig;
