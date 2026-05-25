import { useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { CMS_DEFAULTS, type CmsPage } from '../data/cmsDefaults'

function isBuiltinPage(page: CmsPage): page is keyof typeof CMS_DEFAULTS {
  return page === 'home' || page === 'services' || page === 'reviews'
}

export function useCmsPage(page: CmsPage) {
  const blocks = useQuery(api.cms.listByPage, { page })

  const blockMap = useMemo(() => {
    const map = new Map<string, { value: string; href?: string; type: string }>()
    for (const block of blocks ?? []) {
      map.set(block.key, {
        value: block.value,
        href: block.meta?.href,
        type: block.type,
      })
    }
    return map
  }, [blocks])

  const getText = (key: string) => {
    const fromDb = blockMap.get(key)
    if (fromDb) return fromDb.value
    if (isBuiltinPage(page)) return CMS_DEFAULTS[page][key]?.value ?? ''
    return ''
  }

  const getButton = (key: string) => {
    const fromDb = blockMap.get(key)
    const fallback = isBuiltinPage(page) ? CMS_DEFAULTS[page][key] : undefined
    return {
      label: fromDb?.value ?? fallback?.value ?? '',
      href: fromDb?.href ?? fallback?.href ?? '/',
    }
  }

  return { blocks, getText, getButton, isLoading: blocks === undefined }
}
