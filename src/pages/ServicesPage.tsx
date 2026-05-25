import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { CmsSlot, useCustomBlocks } from '../components/cms/CmsSlot'
import { EditableBlock } from '../components/cms/EditableBlock'
import { EditableServiceCard } from '../components/cms/EditableServiceCard'
import { LoadingState } from '../components/LoadingState'
import { useCmsPage } from '../hooks/useCmsPage'

export function ServicesPage() {
  const services = useQuery(api.services.list)
  const cms = useCmsPage('services')
  const customBlocks = useCustomBlocks(cms.blocks)

  if (services === undefined || cms.isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <EditableBlock page="services" cmsKey="services.page.title" type="text" value={cms.getText('services.page.title')} className="text-2xl font-bold text-white sm:text-3xl" as="h1" />
        <EditableBlock page="services" cmsKey="services.page.description" type="text" value={cms.getText('services.page.description')} className="mt-2 text-sm text-white/55 sm:text-base" as="p" />
      </div>

      <CmsSlot page="services" slot="header-after" blocks={customBlocks} />

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        {services.map((service, i) => (
          <EditableServiceCard key={service._id} service={service} delay={i * 0.08} />
        ))}
      </div>

      <CmsSlot page="services" slot="list-after" blocks={customBlocks} />
      <CmsSlot page="services" slot="page-end" blocks={customBlocks} />
    </div>
  )
}
