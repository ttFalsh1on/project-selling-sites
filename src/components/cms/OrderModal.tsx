import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ServiceDoc } from '../../types/api'

interface OrderModalProps {
  service?: ServiceDoc
  onClose: () => void
}

const PHONE = '89031606997'
const PHONE_TEL = '+79031606997'
const TG_LINK = 'https://t.me/im_falsh1on'
const VK_LINK = 'https://vk.ru/filpish'

export function OrderModal({ service, onClose }: OrderModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="glass-panel max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl p-6 text-center"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <h3 className="text-xl font-bold text-white sm:text-2xl">
          Напиши мне — и мы обсудим ваши желания
        </h3>
        <p className="mt-2 text-sm text-white/60">
          {service
            ? `По услуге «${service.title}» свяжитесь со мной любым удобным способом.`
            : 'Свяжитесь со мной любым удобным способом.'}
        </p>

        <div className="mt-5 space-y-3 text-left">
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-accent-purple hover:bg-white/10"
          >
            <span className="text-white/60">Телефон</span>
            <span className="font-semibold">{PHONE}</span>
          </a>
          <a
            href={TG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-accent-purple hover:bg-white/10"
          >
            <span className="text-white/60">Telegram</span>
            <span className="font-semibold">@im_falsh1on</span>
          </a>
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-accent-purple hover:bg-white/10"
          >
            <span className="text-white/60">MAX</span>
            <span className="font-semibold">{PHONE}</span>
          </a>
          <a
            href={VK_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-accent-purple hover:bg-white/10"
          >
            <span className="text-white/60">VK</span>
            <span className="font-semibold">vk.ru/filpish</span>
          </a>
        </div>

        <button type="button" onClick={onClose} className="btn-secondary mt-5 w-full">
          Закрыть
        </button>
      </motion.div>
    </motion.div>
  )
}
