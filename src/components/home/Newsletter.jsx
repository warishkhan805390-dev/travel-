import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiSend, FiMail, FiCheck } from 'react-icons/fi';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.08),transparent_60%)]" />

      <motion.div
        ref={ref}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="relative bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-700/50 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl" />

          <motion.div
            className="absolute top-10 left-10 text-6xl opacity-10 pointer-events-none"
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            ✈️
          </motion.div>
          <motion.div
            className="absolute bottom-10 right-16 text-5xl opacity-10 pointer-events-none"
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            🌍
          </motion.div>

          <div className="relative z-10 text-center">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <FiMail className="text-amber-400" size={28} />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Get exclusive deals, travel inspiration, and insider tips delivered to your inbox
            </p>

            <div className="max-w-lg mx-auto">
              <div className="flex items-center bg-gray-700/50 rounded-full p-1.5 border border-gray-600/50 focus-within:border-amber-500/50 transition-all duration-300 mb-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/40 px-4 py-3 outline-none"
                />
                <button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-orange-500/30 flex items-center gap-2">
                  Subscribe
                  <FiSend size={16} />
                </button>
              </div>

              <label className="flex items-center justify-center gap-2 cursor-pointer">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    agreed
                      ? 'bg-amber-500 border-amber-500'
                      : 'border-gray-500 hover:border-gray-400'
                  }`}
                >
                  {agreed && <FiCheck className="text-white" size={14} />}
                </div>
                <span className="text-gray-400 text-sm">
                  I agree to receive travel deals and updates
                </span>
              </label>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
