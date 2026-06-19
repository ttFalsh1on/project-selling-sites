import { useState } from 'react'
import { useMutation } from '../../hooks/useApi'
import { api } from '../../api/paths'
import type { CmsBlockDoc } from '../../types/api'
import { GlassCard } from '../GlassCard'
import { CmsActionMenu } from './CmsActionMenu'
import { CmsEditModal } from './CmsEditModal'
import { useCmsMode } from './CmsProvider'

export interface CustomBlock {
  _id: string
  page: string
  key: string
  type: 'text' | 'image' | 'video' | 'button'
  value: string
  imageUrl?: string | null
  videoUrl?: string | null
  meta?: {
    href?: string
    videoUrl?: string
    slot?: string
    align?: 'left' | 'center' | 'right'
  } | null
  sortOrder: number
}

function alignClass(align?: string) {
  if (align === 'left') return 'text-left mr-auto'
  if (align === 'right') return 'text-right ml-auto'
  return 'text-center mx-auto'
}

function CustomBlockContent({ block }: { block: CustomBlock }) {
  const align = alignClass(block.meta?.align)

  if (block.type === 'text') {
    return <p className={`max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base ${align}`}>{block.value}</p>
  }

  if (block.type === 'image' && block.imageUrl) {
    return (
      <img
        src={block.imageUrl}
        alt={block.value}
        className={`max-h-[480px] max-w-full rounded-xl object-contain ${align}`}
      />
    )
  }

  if (block.type === 'video' && block.videoUrl) {
    const isEmbed = /youtube|youtu\.be|vimeo/.test(block.videoUrl)
    if (isEmbed) {
      return (
        <div className={`aspect-video w-full max-w-3xl overflow-hidden rounded-xl ${align}`}>
          <iframe
            src={toEmbedUrl(block.videoUrl)}
            title={block.value}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }
    return (
      <video
        src={block.videoUrl}
        controls
        className={`max-h-[480px] max-w-full rounded-xl ${align}`}
      />
    )
  }

  return null
}

function toEmbedUrl(url: string) {
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split(/[?&]/)[0]
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('youtube.com/watch')) {
    const id = new URL(url).searchParams.get('v')
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('vimeo.com')) {
    const id = url.split('vimeo.com/')[1]?.split(/[?&]/)[0]
    return `https://player.vimeo.com/video/${id}`
  }
  return url
}

function EditableCustomBlock({ block }: { block: CustomBlock }) {
  const isCmsMode = useCmsMode()
  const remove = useMutation(api.cms.remove)
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const [editing, setEditing] = useState(false)

  const handleDelete = async () => {
    if (window.confirm('Удалить этот блок?')) {
      await remove({ page: block.page, key: block.key })
    }
  }

  const content = (
    <GlassCard className="p-4 sm:p-6">
      <CustomBlockContent block={block} />
    </GlassCard>
  )

  if (!isCmsMode) return content

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          setMenu({ x: e.clientX, y: e.clientY })
        }}
        className="cursor-pointer rounded-2xl ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-[#0a0a0a] hover:ring-cyan-400"
      >
        {content}
      </div>

      {menu && (
        <CmsActionMenu
          x={menu.x}
          y={menu.y}
          onEdit={() => {
            setMenu(null)
            setEditing(true)
          }}
          onDelete={() => void handleDelete()}
          onClose={() => setMenu(null)}
        />
      )}

      {editing && (
        <CmsEditModal
          page={block.page as 'home' | 'services' | 'reviews'}
          cmsKey={block.key}
          type={block.type === 'video' ? 'video' : block.type === 'image' ? 'image' : 'text'}
          initialValue={block.value}
          initialVideoUrl={block.meta?.videoUrl ?? block.videoUrl ?? ''}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  )
}

interface CmsSlotProps {
  page: string
  slot: string
  blocks: CustomBlock[]
}

export function CmsSlot({ slot, blocks }: CmsSlotProps) {
  const items = blocks
    .filter((b) => b.key.startsWith('custom.') && (b.meta?.slot ?? 'page-end') === slot)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  if (items.length === 0) return null

  return (
    <div className="space-y-4">
      {items.map((block) => (
        <EditableCustomBlock key={block._id} block={block} />
      ))}
    </div>
  )
}

export function useCustomBlocks(blocks: CmsBlockDoc[] | null | undefined): CustomBlock[] {
  return (blocks ?? [])
    .filter((b) => b.key.startsWith('custom.'))
    .map((b) => ({
      ...b,
      type: b.type as CustomBlock['type'],
      meta: b.meta
        ? {
            ...b.meta,
            align: b.meta.align as CustomBlock['meta'] extends { align?: infer A } ? A : never,
          }
        : b.meta,
    })) as CustomBlock[]
}
