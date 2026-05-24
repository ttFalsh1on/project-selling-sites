import { useState, type MouseEvent, type ReactNode } from 'react'
import { useCmsMode } from './CmsProvider'
import { CmsActionMenu } from './CmsActionMenu'

interface EditableEntityWrapperProps {
  children: ReactNode
  className?: string
  onEdit: () => void
  onDelete: () => void
}

export function EditableEntityWrapper({
  children,
  className = '',
  onEdit,
  onDelete,
}: EditableEntityWrapperProps) {
  const isCmsMode = useCmsMode()
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)

  if (!isCmsMode) {
    return <>{children}</>
  }

  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMenu({ x: e.clientX, y: e.clientY })
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === 'Enter' && handleClick(e as unknown as MouseEvent)}
        className={`cursor-pointer rounded-2xl ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-[#0a0a0a] transition-all hover:ring-cyan-400 ${className}`}
      >
        {children}
      </div>

      {menu && (
        <CmsActionMenu
          x={menu.x}
          y={menu.y}
          onEdit={() => {
            setMenu(null)
            onEdit()
          }}
          onDelete={() => {
            setMenu(null)
            onDelete()
          }}
          onClose={() => setMenu(null)}
        />
      )}
    </>
  )
}
