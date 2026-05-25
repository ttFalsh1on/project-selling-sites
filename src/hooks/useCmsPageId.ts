import { useLocation } from 'react-router-dom'
import { cmsPageFromSlug } from '../lib/pageSlug'

export function useCmsPageId(): string {
  const { pathname } = useLocation()
  if (pathname === '/services') return 'services'
  if (pathname === '/reviews') return 'reviews'
  const customMatch = pathname.match(/^\/p\/([^/]+)$/)
  if (customMatch) return cmsPageFromSlug(customMatch[1])
  return 'home'
}

export function useCustomPageSlug(): string | null {
  const { pathname } = useLocation()
  const match = pathname.match(/^\/p\/([^/]+)$/)
  return match ? match[1] : null
}
