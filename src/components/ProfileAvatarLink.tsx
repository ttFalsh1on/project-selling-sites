import { NavLink } from 'react-router-dom'
import { useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { api } from '../../convex/_generated/api'
import { profilePath } from '../data/navigation'
import { UserAvatar } from './UserAvatar'

export function ProfileAvatarLink() {
  const profileData = useQuery(api.profiles.getMe)
  const name = profileData?.profile.name ?? 'Гость'

  return (
    <NavLink
      to={profilePath}
      aria-label="Профиль"
      title="Профиль"
      className={({ isActive }) =>
        `relative block shrink-0 transition-all ${
          isActive
            ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0a0a0a] rounded-full shadow-[0_0_20px_rgba(0,255,255,0.5)]'
            : 'rounded-full ring-1 ring-white/25 hover:ring-cyan-400/70 hover:shadow-[0_0_16px_rgba(0,255,255,0.35)]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <UserAvatar
            name={name}
            avatarUrl={profileData?.avatarUrl}
            size="sm"
            className="shadow-none"
          />
          {isActive && (
            <motion.span
              layoutId="profile-active-ring"
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0a0a0a] bg-cyber-green"
              style={{ boxShadow: '0 0 8px #39ff14' }}
            />
          )}
        </>
      )}
    </NavLink>
  )
}
