/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'uploadthing.com',
        'utfs.io',
        'img.clerk.com',
        'subdomain',
        'files.stripe.com',
      ],
    },
    reactStrictMode: false,
  
  
    typescript: {
      // Ignoring TypeScript errors during build
      ignoreBuildErrors: true,
    },
  
    eslint:{
      ignoreDuringBuilds: true
  },
  
  
  };
  
  export default nextConfig;
  
  
  
  
  
  
  