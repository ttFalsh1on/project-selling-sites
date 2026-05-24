import { getInitials } from '../data/userProfile'

interface UserAvatarProps {
  name: string
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'h-10 w-10 text-xs sm:h-11 sm:w-11 sm:text-sm',
  md: 'h-16 w-16 text-xl sm:h-20 sm:w-20 sm:text-2xl',
  lg: 'h-24 w-24 text-3xl',
}

export function UserAvatar({ name, avatarUrl, size = 'sm', className = '' }: UserAvatarProps) {
  const initials = getInitials(name)
  const roundedClass = size === 'sm' ? 'rounded-full' : 'rounded-2xl'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses[size]} ${roundedClass} shrink-0 object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} ${roundedClass} flex shrink-0 items-center justify-center bg-gradient-to-br from-[#4361ee] to-fuchsia-500 font-bold text-white shadow-[0_0_24px_rgba(67,97,238,0.4)] ${className}`}
    >
      {initials}
    </div>
  )
}
