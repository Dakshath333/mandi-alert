import { motion } from 'framer-motion'

/**
 * AlertBadge – renders a single SMS alert record
 */
export default function AlertBadge({ message, sentAt, status, crop, mandi, price, delay = 0 }) {
  const time = sentAt
    ? new Date(sentAt).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : ''

  const statusColor = {
    sent: 'bg-green-100 text-green-700',
    simulated: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700',
  }[status] || 'bg-gray-100 text-gray-600'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex gap-3 p-4 bg-white rounded-xl border border-green-100 shadow-sm"
    >
      <span className="text-2xl mt-0.5">📱</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
            {status}
          </span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
      </div>
    </motion.div>
  )
}
