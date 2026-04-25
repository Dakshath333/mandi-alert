import { motion } from 'framer-motion'

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full"
      />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}
