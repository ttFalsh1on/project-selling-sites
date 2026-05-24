import { motion } from 'framer-motion'

export function NeonBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="grid-bg absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, #1a0033 0%, transparent 50%),
            linear-gradient(225deg, rgba(0, 255, 255, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(255, 0, 255, 0.08) 0%, transparent 60%)
          `,
        }}
      />
      <motion.div
        className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  )
}
