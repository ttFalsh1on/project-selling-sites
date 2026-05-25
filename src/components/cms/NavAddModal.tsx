import { useEffect, useState } from 'react'
import { useMutation } from 'convex/react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../../convex/_generated/api'
import { slugify } from '../../lib/pageSlug'
import { useCmsAwarePath } from '../../hooks/useCmsAwarePath'

interface NavAddModalProps {
  onClose: () => void
  onCreated?: () => void
}

export function NavAddModal({ onClose, onCreated }: NavAddModalProps) {
  const createPage = useMutation(api.navItems.createCustomPage)
  const navigate = useNavigate()
  const cmsPath = useCmsAwarePath()

  const [label, setLabel] = useState('')
  const [slug, setSlug] = useState('')
  const [icon, setIcon] = useState('📄')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (label.trim()) setSlug(slugify(label))
  }, [label])

  const handleCreate = async () => {
    if (!label.trim()) return
    setSaving(true)
    setError(null)
    try {
      const result = await createPage({
        label: label.trim(),
        icon: icon.trim() || '📄',
        slug: slug.trim() || undefined,
      })
      onCreated?.()
      onClose()
      navigate(cmsPath(result.path))
    } catch {
      setError('Не удалось создать вкладку. Попробуйте другое название.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[420] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6">
        <h3 className="mb-1 text-lg font-bold text-white">Новая вкладка</h3>
        <p className="mb-4 text-sm text-white/50">
          Создаст новую страницу в меню. На неё можно добавлять текст, фото и видео через +.
        </p>

        <div className="space-y-3">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Название вкладки (например: О нас)"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
          <input
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="Адрес страницы (o-nas)"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 outline-none focus:border-accent-purple"
          />
          <p className="text-xs text-white/35">Страница откроется по адресу /p/{slug || '...'}</p>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="Иконка (emoji)"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
        </div>

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={saving || !label.trim()}
            className="btn-primary flex-1"
          >
            {saving ? 'Создание...' : 'Создать и открыть'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}
