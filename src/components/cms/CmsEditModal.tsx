import { useEffect, useRef, useState } from 'react'
import { useMutation } from 'convex/react'
import type { Id } from '../../../convex/_generated/dataModel'
import { api } from '../../../convex/_generated/api'
import type { CmsPage } from '../../data/cmsDefaults'

interface CmsEditModalProps {
  page: CmsPage
  cmsKey: string
  type: 'text' | 'button' | 'image'
  initialValue: string
  initialHref?: string
  onClose: () => void
}

export function CmsEditModal({
  page,
  cmsKey,
  type,
  initialValue,
  initialHref = '/',
  onClose,
}: CmsEditModalProps) {
  const upsert = useMutation(api.cms.upsert)
  const generateUploadUrl = useMutation(api.cms.generateUploadUrl)
  const [value, setValue] = useState(initialValue)
  const [href, setHref] = useState(initialHref)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setValue(initialValue)
    setHref(initialHref)
  }, [initialValue, initialHref])

  const handleSave = async () => {
    setSaving(true)
    try {
      await upsert({
        page,
        key: cmsKey,
        type: type === 'image' ? 'image' : type,
        value: type === 'image' ? initialValue || 'Изображение' : value,
        meta: type === 'button' ? { href } : undefined,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!result.ok) throw new Error('Upload failed')
      const { storageId } = (await result.json()) as { storageId: string }
      await upsert({
        page,
        key: cmsKey,
        type: 'image',
        value: file.name,
        imageStorageId: storageId as Id<'_storage'>,
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

        <div className="flex gap-3">
          {type !== 'image' && (
            <button type="button" onClick={() => void handleSave()} disabled={saving} className="btn-primary flex-1">
              {saving ? 'Сохранение...' : 'Сохранить'}
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
