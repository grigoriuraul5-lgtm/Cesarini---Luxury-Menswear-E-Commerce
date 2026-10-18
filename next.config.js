/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // Produsele generice de dinainte de catalogul real (18.10.2026) → produsele reale echivalente
  async redirects() {
    return [
      { source: '/produs/costum-ceremonie', destination: '/colectii/costume-ceremonie', permanent: true },
      { source: '/produs/costum-business-casual', destination: '/colectii/costume-business-casual', permanent: true },
      { source: '/produs/pantofi-oxford-negru-lucios', destination: '/produs/pantofi-oxford-negru-semilucios', permanent: true },
      { source: '/produs/pantofi-oxford-mat', destination: '/produs/pantofi-oxford-negru-mat', permanent: true },
      { source: '/produs/pantofi-oxford-medalion', destination: '/produs/pantofi-oxford-medalion-negru', permanent: true },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // 85 pentru fotografiile de produs, 92 pentru vizualizarea mărită de pe pagina produsului
    qualities: [75, 85, 92],
    // păstrează variantele optimizate o lună în cache-ul Vercel
    minimumCacheTTL: 2678400,
    // Placeholder-e Unsplash până la ședința foto Cesarini (servite prin loader-ul din lib/media.ts)
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};
