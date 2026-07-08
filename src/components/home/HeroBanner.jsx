import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiStar, FiGlobe, FiUsers } from 'react-icons/fi';
import { IoLocationSharp } from 'react-icons/io5';

const stats = [
  { value: '500+', label: 'Destinations', icon: FiGlobe },
  { value: '10k+', label: 'Happy Travelers', icon: FiUsers },
  { value: '50+', label: 'Countries', icon: FiMapPin },
  { value: '4.8', label: 'Rating', icon: FiStar },
];

const partners = ['Emirates', 'Qatar Airways', 'Marriott', 'Hilton', 'Expedia', 'Booking.com'];

const floatingElements = [
  { emoji: '✈️', x: 100, y: 150, size: 40, delay: 0 },
  { emoji: '☁️', x: 300, y: 80, size: 60, delay: 0.5 },
  { emoji: '☁️', x: 600, y: 120, size: 50, delay: 1 },
  { emoji: '✈️', x: 800, y: 200, size: 35, delay: 1.5 },
  { emoji: '☁️', x: 1000, y: 60, size: 45, delay: 2 },
  { emoji: '🌍', x: 150, y: 300, size: 30, delay: 0.8 },
];

const HeroBanner = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')`,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {floatingElements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none text-4xl"
          style={{ left: `${el.x}px`, top: `${el.y}px` }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4 + el.delay,
            repeat: Infinity,
            delay: el.delay,
            ease: 'easeInOut',
          }}
        >
          {el.emoji}
        </motion.div>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.span
            className="inline-block px-6 py-2 mb-6 text-sm font-semibold tracking-wider uppercase text-white bg-white/10 backdrop-blur-md rounded-full border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your Journey Begins Here
          </motion.span>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Explore The World
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 bg-clip-text text-transparent">
              With Comfort
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Discover extraordinary destinations and create unforgettable memories
            with our premium travel experiences
          </motion.p>

          <motion.div
            className="max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-full p-1.5 border border-white/20 shadow-2xl">
              <div className="flex-1 flex items-center px-6">
                <FiSearch className="text-white/60 mr-3" size={20} />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-white/50 py-4 outline-none text-lg"
                />
              </div>
              <button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-orange-500/30">
                Search
              </button>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <stat.icon className="text-amber-400 mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-wrap justify-center items-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="text-white/40 text-sm uppercase tracking-widest font-medium">Trusted by</span>
          {partners.map((partner, i) => (
            <span
              key={i}
              className="text-white/30 hover:text-white/60 text-sm font-semibold tracking-wider transition-colors duration-300"
            >
              {partner}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <motion.div className="w-1.5 h-3 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroBanner;
