const nextConfig = {
  images: { domains: ['media-blog.jobsgo.vn', 'thanhnien.vn'] },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
