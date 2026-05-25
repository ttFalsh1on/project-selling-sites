import { useLocation } from 'react-router-dom'
import type { CmsPage } from '../data/cmsDefaults'

export function useCmsPageId(): CmsPage {
  const { pathname } = useLocation()
  if (pathname === '/services') return 'services'
  if (pathname === '/reviews') return 'reviews'
  return 'home'
}
