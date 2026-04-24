import { motion } from 'framer-motion'

/**
 * StatCard – animated card for displaying a key metric
 */
export default function StatCard({ icon, label, value, color = 'green', delay = 0 }) {
  const colorMap = {
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`card border ${colorMap[color]}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium opacity-70">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value ?? '—'}</p>
    </motion.div>
  )
}
