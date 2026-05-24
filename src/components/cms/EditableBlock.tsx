import { useState, type MouseEvent, type ReactNode } from 'react'
import { useMutation } from 'convex/react'
import { Link } from 'react-router-dom'
import { api } from '../../../convex/_generated/api'
import type { CmsPage } from '../../data/cmsDefaults'
import { useCmsMode } from './CmsProvider'
import { CmsActionMenu } from './CmsActionMenu'
import { CmsEditModal } from './CmsEditModal'

interface EditableBlockProps {
  page: CmsPage
  cmsKey: string
  type: 'text' | 'button' | 'image'
  value: string
  href?: string
  className?: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3'
  children?: ReactNode
}

export function EditableBlock({
  page,
  cmsKey,
  type,
  value,
  href = '/',
  className = '',
  as: Tag = 'span',
  children,
}: EditableBlockProps) {
  const isCmsMode = useCmsMode()
  const remove = useMutation(api.cms.remove)
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)
  const [editing, setEditing] = useState(false)

  const handleClick = (e: MouseEvent) => {
    if (!isCmsMode) return
    e.preventDefault()
    e.stopPropagation()
    setMenu({ x: e.clientX, y: e.clientY })
  }

  const handleDelete = async () => {
    setMenu(null)
    if (window.confirm('Удалить этот элемент?')) {
      await remove({ page, key: cmsKey })
    }
  }

  const content =
    children ??
    (type === 'button' ? (
      <Link to={href} className={isCmsMode ? 'pointer-events-none' : undefined}>
        {value}
      </Link>
    ) : (
      value
    ))

  if (!isCmsMode) {
    if (type === 'button') {
      return (
        <Link to={href} className={className}>
          {value}
        </Link>
      )
    }
    return <Tag className={className}>{content}</Tag>
  }

  return (
    <>
      <Tag
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick(e as unknown as MouseEvent)}
        className={`relative cursor-pointer rounded ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-[#0a0a0a] transition-all hover:ring-cyan-400 ${className}`}
      >
        {content}
      </Tag>

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
          page={page}
          cmsKey={cmsKey}
          type={type}
          initialValue={value}
          initialHref={href}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  )
}
