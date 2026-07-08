import { motion } from 'framer-motion'
import { FiLoader, FiGlobe } from 'react-icons/fi'

export default function Loader({ type = 'page' }) {
  if (type === 'page') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 border-r-accent-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FiGlobe className="text-2xl text-primary-500 dark:text-primary-400" />
          </div>
        </motion.div>
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-48 w-full" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full mt-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
          />
        ))}
      </div>
    </div>
  )
}
