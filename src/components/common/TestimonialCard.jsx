import { motion } from 'framer-motion'
import { FaQuoteLeft } from 'react-icons/fa'
import StarRating from './StarRating'

export default function TestimonialCard({ name, location, avatar, rating, text, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card p-6 lg:p-8 relative group hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500"
    >
      {/* Quote Icon */}
      <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300">
        <FaQuoteLeft className="text-sm" />
      </div>

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={rating} showValue />
      </div>

      {/* Review Text */}
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-4">
        &ldquo;{text}&rdquo;
      </p>

      {/* User Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700/50">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary-500/20 flex-shrink-0">
          <img
            src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{location}</p>
        </div>
      </div>
    </motion.div>
  )
}
