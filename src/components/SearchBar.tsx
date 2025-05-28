import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { useDebounce } from '@/hooks/useDebounce'
import { PWADetails, SearchFilters } from '@/types/pwa'
import { searchPWAs } from '@/lib/api'

interface SearchBarProps {
  initialFilters?: SearchFilters
  onSearch?: (results: PWADetails[]) => void
}

export default function SearchBar({ initialFilters, onSearch }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {})
  const [results, setResults] = useState<PWADetails[]>([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
        setShowFilters(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const searchResults = await searchPWAs(debouncedQuery, filters)
        setResults(searchResults)
        onSearch?.(searchResults)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery, filters, onSearch])

  const handleResultClick = (pwa: PWADetails) => {
    router.push(`/pwa/${pwa.id}`)
    setShowResults(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
      <div className="relative flex items-center">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            placeholder="Search for PWA apps..."
            className="w-full pl-12 pr-4 py-3 rounded-l-full border border-r-0 border-gray-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              bg-white dark:bg-gray-800 dark:border-gray-700"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-3 rounded-r-full border border-l-0 border-gray-200
            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:border-gray-700 dark:hover:bg-gray-700
            ${showFilters ? 'bg-blue-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
        >
          <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg
              border border-gray-200 dark:border-gray-700 z-50"
          >
            <SearchFilters
              filters={filters}
              onChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          </motion.div>
        )}

        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg
              border border-gray-200 dark:border-gray-700 max-h-[calc(100vh-200px)] overflow-y-auto z-40"
          >
            {results.map((pwa) => (
              <SearchResult
                key={pwa.id}
                pwa={pwa}
                onClick={() => handleResultClick(pwa)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface SearchResultProps {
  pwa: PWADetails
  onClick: () => void
}

function SearchResult({ pwa, onClick }: SearchResultProps) {
  return (
    <motion.button
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
      onClick={onClick}
      className="w-full px-4 py-3 flex items-center space-x-3 text-left
        border-b last:border-b-0 border-gray-200 dark:border-gray-700"
    >
      <img
        src={pwa.icons[0].src}
        alt={pwa.name}
        className="w-10 h-10 rounded-lg object-cover"
      />
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{pwa.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
          {pwa.description}
        </p>
      </div>
    </motion.button>
  )
}

interface SearchFiltersProps {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
  onClose: () => void
}

function SearchFilters({ filters, onChange, onClose }: SearchFiltersProps) {
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Categories
        </label>
        <div className="space-y-2">
          {['games', 'productivity', 'social', 'utilities'].map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories?.includes(category)}
                onChange={(e) => {
                  const categories = filters.categories || []
                  handleFilterChange(
                    'categories',
                    e.target.checked
                      ? [...categories, category]
                      : categories.filter((c) => c !== category)
                  )
                }}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 capitalize">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Minimum Rating
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.rating || 0}
          onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {filters.rating || 0} stars and up
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Features
        </label>
        <div className="space-y-2">
          {['offline', 'notifications', 'installable'].map((feature) => (
            <label key={feature} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.features?.includes(feature as any)}
                onChange={(e) => {
                  const features = filters.features || []
                  handleFilterChange(
                    'features',
                    e.target.checked
                      ? [...features, feature]
                      : features.filter((f) => f !== feature)
                  )
                }}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 capitalize">
                {feature.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sort By
        </label>
        <select
          value={filters.sort || 'relevance'}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800
            dark:border-gray-700"
        >
          <option value="relevance">Relevance</option>
          <option value="rating">Rating</option>
          <option value="downloads">Downloads</option>
          <option value="newest">Newest</option>
          <option value="updated">Recently Updated</option>
        </select>
      </div>

      <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            onChange({})
            onClose()
          }}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900
            dark:hover:text-gray-100"
        >
          Reset
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  )
}
