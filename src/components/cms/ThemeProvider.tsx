import { useEffect, type ReactNode } from 'react'
import { useQuery } from '../../hooks/useApi'
import { api } from '../../api/paths'
import type { ThemeColors } from '../../types/api'
import { DEFAULT_THEME_COLORS, THEME_COLOR_KEYS, type ThemeColorKey } from '../../data/cmsDefaults'

function applyThemeColors(colors: Record<string, string>) {
  const root = document.documentElement
  for (const [key, cssVar] of Object.entries(THEME_COLOR_KEYS)) {
    const value = colors[key] ?? DEFAULT_THEME_COLORS[key as ThemeColorKey]
    root.style.setProperty(cssVar, value)
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colors = useQuery<ThemeColors>(api.theme.get)

  useEffect(() => {
    applyThemeColors(colors ?? DEFAULT_THEME_COLORS)
  }, [colors])

  return children
}
