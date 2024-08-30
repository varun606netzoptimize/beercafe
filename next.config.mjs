/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
        locale: false
      }
    ]
  },
  images: {
    domains: ['yavuzceliker.github.io', 'www.freepik.com', 'img.freepik.com'], // Add freepik.com to the domains array
  },
}

export default nextConfig
