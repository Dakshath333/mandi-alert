import { motion } from 'framer-motion'

/**
 * PriceCard – displays a mandi price entry
 */
export default function PriceCard({ crop, mandi, location, price, date, isBest = false, delay = 0 }) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
      className={`card relative overflow-hidden ${isBest ? 'border-green-400 border-2' : ''}`}
    >
      {isBest && (
        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          Best Price 🏆
        </span>
      )}

      {/* Crop emoji header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{cropEmoji(crop)}</span>
        <div>
          <p className="font-semibold text-gray-900">{crop}</p>
          <p className="text-xs text-gray-500">{mandi} Mandi · {location}</p>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-green-700">₹{price?.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 mt-0.5">per quintal</p>
        </div>
        {formattedDate && (
          <p className="text-xs text-gray-400">{formattedDate}</p>
        )}
      </div>
    </motion.div>
  )
}

function cropEmoji(crop = '') {
  const map = {
    tomato: '🍅', onion: '🧅', potato: '🥔', rice: '🌾',
    maize: '🌽', sugarcane: '🎋', ragi: '🌾', groundnut: '🥜',
    wheat: '🌾', banana: '🍌', mango: '🥭',
  }
  return map[crop.toLowerCase()] || '🌿'
}
