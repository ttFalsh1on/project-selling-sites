import { motion } from 'framer-motion'

interface CmsActionMenuProps {
  x: number
  y: number
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export function CmsActionMenu({ x, y, onEdit, onDelete, onClose }: CmsActionMenuProps) {
  return (
    <>
      <div className="fixed inset-0 z-[350]" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel fixed z-[360] min-w-[160px] overflow-hidden rounded-xl p-1 shadow-[0_0_24px_rgba(0,255,255,0.2)]"
        style={{ left: Math.min(x, window.innerWidth - 180), top: Math.min(y, window.innerHeight - 120) }}
      >
        <button
          type="button"
          onClick={onEdit}
          className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-semibold text-white hover:bg-white/10"
        >
          Изменить
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="block w-full rounded-lg px-4 py-2.5 text-left text-sm font-semibold text-red-400 hover:bg-red-400/10"
        >
          Удалить
        </button>
      </motion.div>
    </>
  )
}
