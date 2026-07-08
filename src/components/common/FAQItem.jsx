import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi'

export default function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <motion.div
      layout
      className={`rounded-2xl border transition-all duration-300 ${
        isOpen
          ? 'border-primary-500/30 bg-primary-50/50 dark:bg-primary-900/10 shadow-lg shadow-primary-500/5'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`text-sm md:text-base font-medium transition-colors duration-300 ${
          isOpen ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
        }`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          isOpen
            ? 'bg-primary-500 text-white rotate-180'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
        }`}>
          {isOpen ? <HiOutlineMinus className="text-sm" /> : <HiOutlinePlus className="text-sm" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5">
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
