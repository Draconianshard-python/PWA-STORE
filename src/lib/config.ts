export const config = {
  // GitHub Pages base URL
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
  // Serverless API endpoints
  api: {
    // Using MongoDB Atlas for data storage
    dbUrl: process.env.MONGODB_URI || '',
    // Using Cloudinary for PWA assets storage
    cloudinaryUrl: process.env.NEXT_PUBLIC_CLOUDINARY_URL || '',
    // Using Vercel KV for caching
    cacheUrl: process.env.KV_REST_API_URL || '',
  },
  // PWA configuration
  pwa: {
    name: 'PWA App Store',
    short_name: 'PWA Store',
    description: 'Your iOS PWA App Store',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#007AFF',
  }
}
