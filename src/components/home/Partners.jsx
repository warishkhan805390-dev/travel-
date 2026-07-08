import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const partners = [
  { name: 'Emirates', gradient: 'from-red-500 to-red-700' },
  { name: 'Qatar Airways', gradient: 'from-purple-500 to-purple-700' },
  { name: 'Marriott', gradient: 'from-blue-500 to-blue-700' },
  { name: 'Hilton', gradient: 'from-cyan-500 to-cyan-700' },
  { name: 'Expedia', gradient: 'from-yellow-500 to-yellow-700' },
  { name: 'Booking.com', gradient: 'from-blue-600 to-indigo-700' },
  { name: 'Airbnb', gradient: 'from-rose-500 to-rose-700' },
  { name: 'TripAdvisor', gradient: 'from-emerald-500 to-emerald-700' },
];

const Partners = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">Partners</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
            Our Trusted Partners
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            We collaborate with the world's leading travel and hospitality brands
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent z-10" />

        <motion.div
          className="flex gap-16 items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          whileHover={{ animationPlayState: 'paused' }}
          style={{ width: 'fit-content' }}
        >
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={i}
              className="flex-shrink-0 group cursor-pointer"
            >
              <div
                className={`w-44 h-20 rounded-2xl bg-gradient-to-br ${partner.gradient} bg-opacity-20 flex items-center justify-center border border-white/10 hover:border-white/20 transition-all duration-300`}
              >
                <span className="text-white/70 group-hover:text-white font-bold text-sm tracking-wider transition-colors duration-300">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
