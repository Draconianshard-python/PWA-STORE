import Image from 'next/image'
import { motion } from 'framer-motion'
import { PWADetails } from '@/types/pwa'

interface FeaturedCardProps {
  pwa?: PWADetails
}

export default function FeaturedCard({ pwa }: FeaturedCardProps) {
  if (!pwa) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden shadow-lg bg-white"
    >
      <div className="relative h-64 w-full">
        <Image
          src={pwa.icons[0].src}
          alt={pwa.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">{pwa.name}</h2>
            <p className="text-gray-600">{pwa.description}</p>
          </div>
          
          <button className="bg-blue-500 text-white px-6 py-2 rounded-full">
            Get
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(pwa.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600">
            ({pwa.reviews.length} reviews)
          </span>
        </div>
      </div>
    </motion.div>
  )
}
