import { useRef, useState } from 'react'
import { useMutation } from 'convex/react'
import type { Id } from '../../convex/_generated/dataModel'
import { api } from '../../convex/_generated/api'

interface AvatarUploadProps {
  onUploaded?: () => void
}

export function AvatarUpload({ onUploaded }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const generateUploadUrl = useMutation(api.profiles.generateUploadUrl)
  const saveAvatar = useMutation(api.profiles.saveAvatar)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Выберите изображение (JPG, PNG, WebP)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Файл слишком большой. Максимум 5 МБ.')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const uploadUrl = await generateUploadUrl()
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!result.ok) throw new Error('Не удалось загрузить файл')

      const { storageId } = (await result.json()) as { storageId: string }
      await saveAvatar({ storageId: storageId as Id<'_storage'> })
      onUploaded?.()
    } catch {
      setError('Ошибка загрузки. Попробуйте ещё раз.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void handleFileChange(e)}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="btn-secondary w-full text-sm sm:w-auto"
      >
        {uploading ? 'Загрузка...' : 'Загрузить аватар'}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
