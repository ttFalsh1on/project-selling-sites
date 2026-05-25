import { useSearchParams } from 'react-router-dom'

/** Сохраняет ?cms=1 при переходах между страницами в режиме редактирования */
export function useCmsAwarePath() {
  const [searchParams] = useSearchParams()
  const preserveCms = searchParams.get('cms') === '1'

  return (path: string) => {
    if (!preserveCms) return path
    if (path.includes('cms=1')) return path

    const [base, query = ''] = path.split('?')
    const params = new URLSearchParams(query)
    params.set('cms', '1')
    const qs = params.toString()
    return qs ? `${base}?${qs}` : `${base}?cms=1`
  }
}
