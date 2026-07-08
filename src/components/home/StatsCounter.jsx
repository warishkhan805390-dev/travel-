import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaSmile, FaGlobeAmericas, FaAward, FaStar } from 'react-icons/fa';

const stats = [
  { icon: FaSmile, value: 12500, label: 'Happy Customers', suffix: '+' },
  { icon: FaGlobeAmericas, value: 850, label: 'Tours Completed', suffix: '+' },
  { icon: FaAward, value: 12, label: 'Years Experience', suffix: '' },
  { icon: FaStar, value: 48, label: 'Awards Won', suffix: '' },
];

const AnimatedNumber = ({ value, isInView: inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(value / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, duration / 60);
    return () => clearInterval(timer);
  }, [value, inView]);

  return <>{count.toLocaleString()}</>;
};

const StatsCounter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/95" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Journey So Far
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Numbers that speak to our commitment to excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="text-amber-400" size={28} />
              </div>
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                <AnimatedNumber value={stat.value} isInView={isInView} />
                {stat.suffix}
              </div>
              <div className="text-gray-400 text-lg font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
