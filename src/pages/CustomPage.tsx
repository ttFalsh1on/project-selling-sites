import { useParams } from 'react-router-dom'
import { CmsSlot, useCustomBlocks } from '../components/cms/CmsSlot'
import { EditableBlock } from '../components/cms/EditableBlock'
import { LoadingState } from '../components/LoadingState'
import { cmsPageFromSlug } from '../lib/pageSlug'
import { useCmsPage } from '../hooks/useCmsPage'

export function CustomPage() {
  const { slug } = useParams<{ slug: string }>()
  if (!slug) return null

  const pageId = cmsPageFromSlug(slug)
  const cms = useCmsPage(pageId)
  const customBlocks = useCustomBlocks(cms.blocks)

  if (cms.isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <EditableBlock
          page={pageId}
          cmsKey="page.title"
          type="text"
          value={cms.getText('page.title')}
          className="text-2xl font-bold text-white sm:text-3xl"
          as="h1"
        />
        <EditableBlock
          page={pageId}
          cmsKey="page.description"
          type="text"
          value={cms.getText('page.description')}
          className="mt-2 text-sm text-white/55 sm:text-base"
          as="p"
        />
      </div>

      <CmsSlot page={pageId} slot="header-after" blocks={customBlocks} />
      <CmsSlot page={pageId} slot="page-end" blocks={customBlocks} />
    </div>
  )
}
