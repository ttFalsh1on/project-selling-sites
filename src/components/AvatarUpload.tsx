import { useRef, useState } from 'react'
import { useMutation } from '../hooks/useApi'
import { api } from '../api/paths'
import { fileToDataUrl } from '../lib/mediaUpload'

interface AvatarUploadProps {
  onUploaded?: () => void
}

export function AvatarUpload({ onUploaded }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
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

    setUploading(true)
    setError(null)

    try {
      const avatarUrl = await fileToDataUrl(file)
      await saveAvatar({ avatarUrl })
      onUploaded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки. Попробуйте ещё раз.')
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
