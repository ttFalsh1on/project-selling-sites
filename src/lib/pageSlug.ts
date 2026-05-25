const CYRILLIC_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
}

export function slugify(text: string): string {
  const lower = text.trim().toLowerCase()
  let result = ''
  for (const char of lower) {
    if (CYRILLIC_MAP[char]) {
      result += CYRILLIC_MAP[char]
    } else if (/[a-z0-9]/.test(char)) {
      result += char
    } else if (/\s|[-_]/.test(char)) {
      result += '-'
    }
  }
  return result.replace(/-+/g, '-').replace(/^-|-$/g, '') || 'page'
}

export function pathToCmsPage(path: string): string | null {
  const match = path.match(/^\/p\/([^/]+)$/)
  return match ? `p.${match[1]}` : null
}

export function cmsPageFromSlug(slug: string): string {
  return `p.${slug}`
}
