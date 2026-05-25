import { Link, type LinkProps } from 'react-router-dom'
import { useCmsAwarePath } from '../../hooks/useCmsAwarePath'

export function CmsLink({ to, ...props }: LinkProps) {
  const cmsPath = useCmsAwarePath()
  const resolvedTo = typeof to === 'string' ? cmsPath(to) : to

  return <Link to={resolvedTo} {...props} />
}
