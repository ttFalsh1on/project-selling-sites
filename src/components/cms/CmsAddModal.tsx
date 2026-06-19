import { useState } from 'react'
import { useMutation } from '../../hooks/useApi'
import { api } from '../../api/paths'
import { getCmsSlots, type CmsSlotId } from '../../data/cmsDefaults'
import { useCmsPageId } from '../../hooks/useCmsPageId'
import { fileToDataUrl } from '../../lib/mediaUpload'

interface CmsAddModalProps {
  onClose: () => void
}

type BlockType = 'text' | 'image' | 'video'

export function CmsAddModal({ onClose }: CmsAddModalProps) {
  const page = useCmsPageId()
  const upsert = useMutation(api.cms.upsert)

  const [type, setType] = useState<BlockType>('text')
  const [slot, setSlot] = useState<CmsSlotId>('page-end')
  const [text, setText] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('center')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const slots = getCmsSlots(page)

  const handleCreate = async (file?: File) => {
    setSaving(true)
    try {
      const key = `custom.${crypto.randomUUID()}`
      const base = { page, key, meta: { slot, align } }

      if (type === 'text') {
        if (!text.trim()) return
        await upsert({ ...base, type: 'text', value: text.trim() })
      } else if (type === 'image') {
        if (!file) return
        setUploading(true)
        const imageUrl = await fileToDataUrl(file)
        await upsert({
          ...base,
          type: 'image',
          value: file.name,
          imageUrl,
        })
      } else if (type === 'video') {
        if (file) {
          setUploading(true)
          const videoUrlData = await fileToDataUrl(file)
          await upsert({
            ...base,
            type: 'video',
            value: file.name,
            videoUrl: videoUrlData,
          })
        } else if (videoUrl.trim()) {
          await upsert({
            ...base,
            type: 'video',
            value: 'Видео',
            meta: { slot, align, videoUrl: videoUrl.trim() },
            videoUrl: videoUrl.trim(),
          })
        } else {
          return
        }
      }

      onClose()
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-panel max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Добавить блок</h3>

        <div className="mb-4 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-white/45">
            Тип контента
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ['text', 'Текст'],
                ['image', 'Фото'],
                ['video', 'Видео'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setType(id)}
                className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                  type === id
                    ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-300'
                    : 'border-white/10 text-white/60 hover:border-white/25'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
            Куда добавить
          </label>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value as CmsSlotId)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          >
            {slots.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#1a1a2e]">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/45">
            Выравнивание
          </label>
          <select
            value={align}
            onChange={(e) => setAlign(e.target.value as 'left' | 'center' | 'right')}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          >
            <option value="left" className="bg-[#1a1a2e]">Слева</option>
            <option value="center" className="bg-[#1a1a2e]">По центру</option>
            <option value="right" className="bg-[#1a1a2e]">Справа</option>
          </select>
        </div>

        {type === 'text' && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите текст..."
            rows={4}
            className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
        )}

        {type === 'image' && (
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-accent-purple file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#121212]"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleCreate(file)
              }}
            />
          </div>
        )}

        {type === 'video' && (
          <div className="mb-4 space-y-3">
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Ссылка на видео (YouTube, mp4...)"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
            />
            <p className="text-center text-xs text-white/40">или загрузите файл</p>
            <input
              type="file"
              accept="video/*"
              className="w-full text-sm text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-accent-teal/80 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#121212]"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleCreate(file)
              }}
            />
          </div>
        )}

        <div className="flex gap-3">
          {type === 'text' && (
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={saving || !text.trim()}
              className="btn-primary flex-1"
            >
              {saving ? 'Добавление...' : 'Добавить'}
            </button>
          )}
          {type === 'video' && !videoUrl.trim() && (
            <button type="button" disabled className="btn-primary flex-1 opacity-50">
              {uploading ? 'Загрузка...' : 'Выберите файл или URL'}
            </button>
          )}
          {type === 'video' && videoUrl.trim() && (
            <button
              type="button"
              onClick={() => void handleCreate()}
              disabled={saving}
              className="btn-primary flex-1"
            >
              {saving ? 'Добавление...' : 'Добавить'}
            </button>
          )}
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}
