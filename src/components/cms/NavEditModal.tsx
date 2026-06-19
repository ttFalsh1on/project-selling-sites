import { useEffect, useState } from 'react'
import { useMutation } from '../../hooks/useApi'
import { api } from '../../api/paths'
import type { NavItemDoc } from '../../types/api'

interface NavEditModalProps {
  item: NavItemDoc
  onClose: () => void
}

export function NavEditModal({ item, onClose }: NavEditModalProps) {
  const update = useMutation(api.navItems.update)
  const [label, setLabel] = useState(item.label)
  const [path, setPath] = useState(item.path)
  const [icon, setIcon] = useState(item.icon)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLabel(item.label)
    setPath(item.path)
    setIcon(item.icon)
  }, [item])

  const handleSave = async () => {
    setSaving(true)
    try {
      await update({
        id: item._id,
        label: label.trim(),
        path: path.trim(),
        icon: icon.trim(),
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[420] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Редактировать пункт меню</h3>
        <div className="space-y-3">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Название"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="Путь (/services)"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Иконка (emoji)"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={() => void handleSave()} disabled={saving} className="btn-primary flex-1">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}
