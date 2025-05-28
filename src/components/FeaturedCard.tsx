import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { StarIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import { PWADetails } from '@/types/pwa'
import { installPWA } from '@/lib/api'

interface PWACardProps {
  pwa: PWADetails
  featured?: boolean
}

export default function PWACard({ pwa, featured }: PWACardProps) {
  const [installing, setInstalling] = useState(false)

  const handleInstall = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (installing) return

    setInstalling(true)
    try {
      await installPWA(pwa.id)
      // Show installation instructions modal
    } catch (error) {
      console.error('Installation failed:', error)
    } finally {
      setInstalling(false)
    }
  }

  return (
    <Link href={`/pwa/${pwa.id}`}>
      <motion.article
        whileHover={{ y: -4 }}
        className={`relative overflow-hidden rounded-xl bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md
          transition-shadow duration-200
          ${featured ? 'col-span-2 md:col-span-3' : ''}`}
      >
        {featured && (
          <div className="absolute top-3 left-3 px-2 py-1 text-xs font-medium
            bg-blue-500 text-white rounded-full">
            Featured
          </div>
        )}

        <div className={`relative ${featured ? 'h-64' : 'h-48'}`}>
          <Image
            src={pwa.screenshots?.[0]?.src || pwa.icons[0].src}
            alt={pwa.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src={pwa.icons[0].src}
                alt={pwa.name}
                width={40}
                height={40}
                className="rounded-xl"
              />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {pwa.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {pwa.developer.name}
                </p>
              </div>
            </div>

            <button
              onClick={handleInstall}
              className={`px-4 py-2 text-sm font-medium rounded-full
                ${installing
                  ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
              {installing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <ArrowDownIcon className="w-4 h-4 inline-block -mt-0.5 mr-1" />
                  Get
                </>
              )}
            </button>
          </div>

          {featured && (
            <p className="mt-3 text
