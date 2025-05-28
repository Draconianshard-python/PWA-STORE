import { Suspense } from 'react'
import { StorageManager } from '@/lib/storage'
import FeaturedApps from '@/components/FeaturedApps'
import CategoryList from '@/components/CategoryList'
import PopularApps from '@/components/PopularApps'
import NewApps from '@/components/NewApps'
import SearchBar from '@/components/SearchBar'
import LoadingSpinner from '@/components/LoadingSpinner'

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const storage = StorageManager.getInstance()
  const featuredPWAs = await storage.getPWAs({ 
    status: 'featured',
    limit: 3 
  })
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-center mb-8">
          Progressive Web App Store
        </h1>
        <SearchBar />
      </section>

      <section className="mb-12">
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedApps pwas={featuredPWAs} />
        </Suspense>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <Suspense fallback={<LoadingSpinner />}>
          <CategoryList />
        </Suspense>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <section>
          <h2 className="text-2xl font-bold mb-6">Popular Apps</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <PopularApps />
          </Suspense>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <NewApps />
          </Suspense>
        </section>
      </div>
    </div>
  )
}
