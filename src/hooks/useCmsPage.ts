import { useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { CMS_DEFAULTS, type CmsPage } from '../data/cmsDefaults'

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
    return CMS_DEFAULTS[page][key]?.value ?? ''
  }

  const getButton = (key: string) => {
    const fromDb = blockMap.get(key)
    const fallback = CMS_DEFAULTS[page][key]
    return {
      label: fromDb?.value ?? fallback?.value ?? '',
      href: fromDb?.href ?? fallback?.href ?? '/',
    }
  }

  return { blocks, getText, getButton, isLoading: blocks === undefined }
}
