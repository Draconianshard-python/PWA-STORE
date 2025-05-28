import { PWADetails, Review, SearchFilters } from '@/types/pwa'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

export async function fetchPWAs(filters?: SearchFilters): Promise<PWADetails[]> {
  const params = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v))
      } else if (value !== undefined) {
        params.append(key, value.toString())
      }
    })
  }

  const response = await fetch(`${API_BASE}/api/pwas?${params}`)
  if (!response.ok) throw new Error('Failed to fetch PWAs')
  return response.json()
}

export async function fetchPWA(id: string): Promise<PWADetails> {
  const response = await fetch(`${API_BASE}/api/pwas/${id}`)
  if (!response.ok) throw new Error('Failed to fetch PWA')
  return response.json()
}

export async function submitReview(
  pwaId: string,
  review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpful' | 'responses'>
): Promise<Review> {
  const response = await fetch(`${API_BASE}/api/pwas/${pwaId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  })
  if (!response.ok) throw new Error('Failed to submit review')
  return response.json()
}

export async function searchPWAs(query: string, filters?: SearchFilters): Promise<PWADetails[]> {
  const params = new URLSearchParams({ q: query })
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v))
      } else if (value !== undefined) {
        params.append(key, value.toString())
      }
    })
  }

  const response = await fetch(`${API_BASE}/api/search?${params}`)
  if (!response.ok) throw new Error('Failed to search PWAs')
  return response.json()
}

export async function installPWA(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/pwas/${id}/install`, {
    method: 'POST'
  })
  if (!response.ok) throw new Error('Failed to record installation')
}

export async function reportPWA(id: string, reason: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/pwas/${id}/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  })
  if (!response.ok) throw new Error('Failed to submit report')
}
