import { useEffect, useRef, useState } from 'react'
import { useMutation } from '../../hooks/useApi'
import { api } from '../../api/paths'
import type { CmsPage } from '../../data/cmsDefaults'
import { fileToDataUrl } from '../../lib/mediaUpload'

interface CmsEditModalProps {
  page: CmsPage
  cmsKey: string
  type: 'text' | 'button' | 'image' | 'video'
  initialValue: string
  initialHref?: string
  initialVideoUrl?: string
  onClose: () => void
}

export function CmsEditModal({
  page,
  cmsKey,
  type,
  initialValue,
  initialHref = '/',
  initialVideoUrl = '',
  onClose,
}: CmsEditModalProps) {
  const upsert = useMutation(api.cms.upsert)
  const [value, setValue] = useState(initialValue)
  const [href, setHref] = useState(initialHref)
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const videoFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(initialValue)
    setHref(initialHref)
    setVideoUrl(initialVideoUrl)
  }, [initialValue, initialHref, initialVideoUrl])

  const handleSave = async () => {
    setSaving(true)
    try {
      await upsert({
        page,
        key: cmsKey,
        type: type === 'image' ? 'image' : type === 'video' ? 'video' : type,
        value: type === 'image' || type === 'video' ? value || 'Медиа' : value,
        meta:
          type === 'button'
            ? { href }
            : type === 'video' && videoUrl.trim()
              ? { videoUrl: videoUrl.trim() }
              : undefined,
        videoUrl: type === 'video' && videoUrl.trim() ? videoUrl.trim() : undefined,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const imageUrl = await fileToDataUrl(file)
      await upsert({
        page,
        key: cmsKey,
        type: 'image',
        value: file.name,
        imageUrl,
      })
      onClose()
    } finally {
      setUploading(false)
    }
  }

  const handleVideoUpload = async (file: File) => {
    setUploading(true)
    try {
      const videoUrlData = await fileToDataUrl(file)
      await upsert({
        page,
        key: cmsKey,
        type: 'video',
        value: file.name,
        videoUrl: videoUrlData,
      })
      onClose()
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6">
        <h3 className="mb-4 text-lg font-bold text-white">Изменить элемент</h3>

        {type === 'text' && (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
          />
        )}

        {type === 'button' && (
          <div className="mb-4 space-y-3">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Текст кнопки"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
            />
            <input
              value={href}
              onChange={(e) => setHref(e.target.value)}
              placeholder="Ссылка (/services)"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
            />
          </div>
        )}

        {type === 'image' && (
          <div className="mb-4">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleImageUpload(file)
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-secondary w-full"
            >
              {uploading ? 'Загрузка...' : 'Выбрать изображение'}
            </button>
          </div>
        )}

        {type === 'video' && (
          <div className="mb-4 space-y-3">
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Ссылка на видео"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-accent-purple"
            />
            <input
              ref={videoFileRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleVideoUpload(file)
              }}
            />
            <button
              type="button"
              onClick={() => videoFileRef.current?.click()}
              disabled={uploading}
              className="btn-secondary w-full"
            >
              {uploading ? 'Загрузка...' : 'Загрузить видеофайл'}
            </button>
          </div>
        )}

        <div className="flex gap-3">
          {type !== 'image' && type !== 'video' && (
            <button type="button" onClick={() => void handleSave()} disabled={saving} className="btn-primary flex-1">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          )}
          {type === 'video' && videoUrl.trim() && (
            <button type="button" onClick={() => void handleSave()} disabled={saving} className="btn-primary flex-1">
              {saving ? 'Сохранение...' : 'Сохранить URL'}
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
