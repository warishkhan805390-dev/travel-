import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCompass, FaMapMarkedAlt, FaPlane, FaArrowLeft } from 'react-icons/fa'

const floatingAnimation = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
}

const planeAnimation = {
  animate: {
    x: [0, 30, 0],
    y: [0, -15, 0],
    rotate: [0, 10, -10, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
}

const compassAnimation = {
  animate: {
    rotate: [0, 360],
    transition: { duration: 8, repeat: Infinity, ease: 'linear' },
  },
}

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary-500/3 to-accent-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-lg">
        {/* Animated Icons */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <motion.div
            {...floatingAnimation}
            className="text-4xl text-primary-500/30 dark:text-primary-400/20"
          >
            <FaCompass />
          </motion.div>
          <motion.div
            {...compassAnimation}
            className="text-5xl text-accent-500/30 dark:text-accent-400/20"
          >
            <FaMapMarkedAlt />
          </motion.div>
          <motion.div
            {...planeAnimation}
            className="text-4xl text-primary-500/30 dark:text-primary-400/20 rotate-45"
          >
            <FaPlane />
          </motion.div>
        </div>

        {/* 404 Text */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
        >
          <h1 className="text-[10rem] md:text-[12rem] font-bold leading-none mb-4 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 bg-clip-text text-transparent">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Looks like you've wandered off the map... Let's get you back on track!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Back to Home
          </Link>
          <Link
            to="/tours"
            className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            Explore Tours
          </Link>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
        >
          <Link to="/" className="hover:text-primary-500 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-primary-500 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-primary-500 transition-colors">Contact</Link>
          <Link to="/blog" className="hover:text-primary-500 transition-colors">Blog</Link>
          <Link to="/faq" className="hover:text-primary-500 transition-colors">FAQ</Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
