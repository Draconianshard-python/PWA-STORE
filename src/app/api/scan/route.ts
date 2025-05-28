import { NextResponse } from 'next/server'
import { StorageManager } from '@/lib/storage'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()
    
    // Fetch manifest
    const manifestResponse = await fetch(`${url}/manifest.json`)
    const manifest = await manifestResponse.json()
    
    // Check for service worker
    const swResponse = await fetch(`${url}/service-worker.js`)
    const hasSW = swResponse.ok
    
    if (!manifest || !hasSW) {
      return NextResponse.json(
        { error: 'Not a valid PWA' },
        { status: 400 }
      )
    }
    
    // Save PWA
    const storage = StorageManager.getInstance()
    const pwa = await storage.savePWA(manifest)
    
    return NextResponse.json({ pwa })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to scan PWA' },
      { status: 500 }
    )
  }
}
