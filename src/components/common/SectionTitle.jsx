import { motion } from 'framer-motion'

export default function SectionTitle({ subtitle, title, description, light = false, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className={`mb-12 lg:mb-16 ${center ? 'text-center' : 'text-left'}`}
    >
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
            light
              ? 'bg-white/10 text-white'
              : 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
          }`}
        >
          {subtitle}
        </motion.span>
      )}
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-bold font-display ${
          light ? 'text-white' : 'text-gray-900 dark:text-white'
        }`}
      >
        {title}
      </h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`mt-4 text-base md:text-lg max-w-2xl ${
            center ? 'mx-auto' : ''
          } ${
            light ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {description}
        </motion.p>
      )}
      <div className={`flex items-center gap-2 mt-6 ${center ? 'justify-center' : ''}`}>
        <span className={`h-1 w-12 rounded-full ${light ? 'bg-primary-400' : 'bg-primary-500'}`} />
        <span className={`h-1 w-4 rounded-full ${light ? 'bg-accent-400' : 'bg-accent-500'}`} />
      </div>
    </motion.div>
  )
}
