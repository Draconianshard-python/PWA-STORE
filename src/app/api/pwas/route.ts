import { NextResponse } from 'next/server'
import { StorageManager } from '@/lib/storage'
import { SearchFilters } from '@/types/pwa'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filters: SearchFilters = {
      categories: searchParams.getAll('categories'),
      rating: Number(searchParams.get('rating')) || undefined,
      features: searchParams.getAll('features') as SearchFilters['features'],
      sort: searchParams.get('sort') as SearchFilters['sort'],
      language: searchParams.get('language') || undefined
    }

    const storage = StorageManager.getInstance()
    const pwas = await storage.getPWAs(filters)
    
    return NextResponse.json(pwas)
  } catch (error) {
    console.error('Failed to fetch PWAs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch PWAs' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const manifest = await request.json()
    const storage = StorageManager.getInstance()
    const pwa = await storage.uploadPWA(manifest)
    
    return NextResponse.json(pwa)
  } catch (error) {
    console.error('Failed to create PWA:', error)
    return NextResponse.json(
      { error: 'Failed to create PWA' },
      { status: 500 }
    )
  }
}
