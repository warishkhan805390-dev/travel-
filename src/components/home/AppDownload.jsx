import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaApple, FaGooglePlay, FaCheckCircle, FaMobileAlt, FaQrcode } from 'react-icons/fa';
import { FiSmartphone } from 'react-icons/fi';

const features = [
  'Easy Booking in Seconds',
  'Exclusive Mobile Deals',
  '24/7 Support Chat',
  'Offline Access to Itineraries',
  'Real-Time Flight Tracking',
];

const AppDownload = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900/20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">App</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
              Download Our App
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Plan, book, and manage your travels on the go with our all-in-one mobile app
            </p>

            <div className="space-y-4 mb-10">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <FaCheckCircle className="text-amber-400 shrink-0" size={20} />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <motion.a
                href="#"
                className="flex items-center gap-3 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaApple size={28} />
                <div>
                  <div className="text-xs text-gray-500">Download on the</div>
                  <div className="text-lg font-bold -mt-1">App Store</div>
                </div>
              </motion.a>
              <motion.a
                href="#"
                className="flex items-center gap-3 bg-white text-gray-900 hover:bg-gray-100 px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaGooglePlay size={24} />
                <div>
                  <div className="text-xs text-gray-500">Get it on</div>
                  <div className="text-lg font-bold -mt-1">Google Play</div>
                </div>
              </motion.a>
            </div>

            <motion.div
              className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-700/50"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-gray-800 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <span className="text-gray-400 text-sm">
                <span className="text-white font-semibold">4.8</span> avg rating across stores
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="relative w-72 h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] border-4 border-gray-700 shadow-2xl" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-700 rounded-full" />

              <div className="absolute inset-4 top-10 bottom-4 bg-gradient-to-b from-amber-400/10 to-orange-500/10 rounded-[2rem] overflow-hidden border border-gray-700/50">
                <div className="p-6 text-center">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FiSmartphone className="text-white" size={28} />
                  </motion.div>
                  <h3 className="text-white font-bold text-lg mb-1">Travel App</h3>
                  <p className="text-gray-400 text-xs mb-6">Your travel companion</p>

                  <div className="space-y-3 mb-6">
                    {['Search', 'Book', 'Explore'].map((item, i) => (
                      <div
                        key={i}
                        className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-sm font-medium border border-white/10"
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <FaQrcode className="text-amber-400" size={24} />
                    </div>
                    <p className="text-white/60 text-xs">Scan to Download</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 shadow-xl hidden lg:block"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <FaMobileAlt className="text-white" size={24} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
