import { createClient } from '@supabase/supabase-js'
import { PWADetails, Review, Category, SearchFilters } from '@/types/pwa'
import { CACHE_DURATION } from './constants'

export class StorageManager {
  private static instance: StorageManager
  private cache: Map<string, { data: any; timestamp: number }>
  private supabase: any

  private constructor() {
    this.cache = new Map()
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  private isCacheValid(key: string, duration: number): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < duration * 1000
  }

  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  async getPWAs(filters?: SearchFilters): Promise<PWADetails[]> {
    const cacheKey = `pwas:${JSON.stringify(filters || {})}`
    
    if (this.isCacheValid(cacheKey, CACHE_DURATION.PWA_LIST)) {
      return this.cache.get(cacheKey)!.data
    }

    let query = this.supabase.from('pwas').select('*')

    if (filters) {
      if (filters.categories?.length) {
        query = query.contains('categories', filters.categories)
      }
      if (filters.rating) {
        query = query.gte('rating', filters.rating)
      }
      if (filters.features?.length) {
        filters.features.forEach(feature => {
          query = query.eq(`features.${feature}`, true)
        })
      }
      if (filters.sort) {
        switch (filters.sort) {
          case 'rating':
            query = query.order('rating', { ascending: false })
            break
          case 'downloads':
            query = query.order('downloads', { ascending: false })
            break
          case 'newest':
            query = query.order('uploadDate', { ascending: false })
            break
          case 'updated':
            query = query.order('lastUpdated', { ascending: false })
            break
        }
      }
    }

    const { data: pwas, error } = await query

    if (error) throw error
    
    this.setCache(cacheKey, pwas)
    return pwas
  }

  async getPWA(id: string): Promise<PWADetails | null> {
    const cacheKey = `pwa:${id}`
    
    if (this.isCacheValid(cacheKey, CACHE_DURATION.PWA_LIST)) {
      return this.cache.get(cacheKey)!.data
    }

    const { data: pwa, error } = await this.supabase
      .from('pwas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    
    this.setCache(cacheKey, pwa)
    return pwa
  }

  async addReview(pwaId: string, review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpful' | 'responses'>) {
    const { data, error } = await this.supabase
      .from('reviews')
      .insert([{
        ...review,
        pwaId,
        helpful: 0,
        responses: [],
        verified: true,
        language: 'en'
      }])
      .single()

    if (error) throw error

    // Invalidate PWA cache
    this.cache.delete(`pwa:${pwaId}`)
    return data
  }

  async searchPWAs(query: string, filters?: SearchFilters): Promise<PWADetails[]> {
    const cacheKey = `search:${query}:${JSON.stringify(filters || {})}`
    
    if (this.isCacheValid(cacheKey, CACHE_DURATION.SEARCH)) {
      return this.cache.get(cacheKey)!.data
    }

    const { data: pwas, error } = await this.supabase
      .rpc('search_pwas', { 
        search_query: query,
        ...filters
      })

    if (error) throw error
    
    this.setCache(cacheKey, pwas)
    return pwas
  }

  async getCategories(): Promise<Category[]> {
    if (this.isCacheValid('categories', CACHE_DURATION.CATEGORIES)) {
      return this.cache.get('categories')!.data
    }

    const { data: categories, error } = await this.supabase
      .from('categories')
      .select('*')
      .order('order')

    if (error) throw error
    
    this.setCache('categories', categories)
    return categories
  }

  async uploadPWA(manifest: PWAManifest): Promise<PWADetails> {
    // Validate manifest
    if (!this.validateManifest(manifest)) {
      throw new Error('Invalid manifest')
    }

    // Upload icons to storage
    const icons = await Promise.all(
      manifest.icons.map(icon => this.uploadAsset(icon.src))
    )

    // Create PWA record
    const { data: pwa, error } = await this.supabase
      .from('pwas')
      .insert([{
        ...manifest,
        icons,
        uploadDate: new Date(),
        lastUpdated: new Date(),
        rating: 0,
        downloads: 0,
        status: 'pending'
      }])
      .single()

    if (error) throw error
    return pwa
  }

  private validateManifest(manifest: PWAManifest): boolean {
    // Implement manifest validation
    return true
  }

  private async uploadAsset(url: string): Promise<string> {
    // Implement asset upload to Supabase storage
    return url
  }
}
