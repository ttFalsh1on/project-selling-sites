import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '../../hooks/useApi'
import { api } from '../../api/paths'
import {
  DEFAULT_THEME_COLORS,
  THEME_COLOR_KEYS,
  THEME_COLOR_LABELS,
  type ThemeColorKey,
} from '../../data/cmsDefaults'
import type { ThemeColors } from '../../types/api'

interface CmsThemePanelProps {
  onClose: () => void
}

export function CmsThemePanel({ onClose }: CmsThemePanelProps) {
  const stored = useQuery<ThemeColors>(api.theme.get)
  const updateTheme = useMutation(api.theme.update)
  const resetTheme = useMutation(api.theme.reset)
  const [colors, setColors] = useState<Record<string, string>>(DEFAULT_THEME_COLORS)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (stored) setColors({ ...DEFAULT_THEME_COLORS, ...stored })
  }, [stored])

  const handleChange = (key: ThemeColorKey, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }))
    document.documentElement.style.setProperty(THEME_COLOR_KEYS[key], value)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateTheme({ colors })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('Сбросить все цвета к стандартным?')) return
    setSaving(true)
    try {
      await resetTheme({})
      setColors(DEFAULT_THEME_COLORS)
      for (const [key, cssVar] of Object.entries(THEME_COLOR_KEYS)) {
        document.documentElement.style.setProperty(
          cssVar,
          DEFAULT_THEME_COLORS[key as ThemeColorKey],
        )
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[380] bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <aside className="glass-panel fixed right-0 top-0 z-[390] flex h-full w-full max-w-sm flex-col border-l border-white/10 shadow-[-8px_0_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="text-lg font-bold text-white">Цвета сайта</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="mb-4 text-xs text-white/45">
            Меняйте цвета — изменения видны сразу. Нажмите «Сохранить» чтобы применить для всех
            посетителей.
          </p>
          <div className="space-y-4">
            {(Object.keys(THEME_COLOR_LABELS) as ThemeColorKey[]).map((key) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={toHexInput(colors[key] ?? DEFAULT_THEME_COLORS[key])}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-white/15 bg-transparent"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{THEME_COLOR_LABELS[key]}</p>
                  <input
                    type="text"
                    value={colors[key] ?? DEFAULT_THEME_COLORS[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="mt-1 w-full rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 outline-none focus:border-accent-purple"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t border-white/10 p-5">
          <button type="button" onClick={() => void handleSave()} disabled={saving} className="btn-primary w-full">
            {saving ? 'Сохранение...' : 'Сохранить цвета'}
          </button>
          <button type="button" onClick={() => void handleReset()} disabled={saving} className="btn-secondary w-full">
            Сбросить по умолчанию
          </button>
        </div>
      </aside>
    </>
  )
}

function toHexInput(color: string): string {
  if (color.startsWith('#') && (color.length === 7 || color.length === 4)) return color.slice(0, 7)
  return '#000000'
}
