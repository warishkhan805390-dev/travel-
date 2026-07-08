import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaShieldAlt, FaHeadset, FaCalendarCheck, FaShieldVirus, FaHotel, FaSmile } from 'react-icons/fa';

const features = [
  { icon: FaShieldAlt, title: 'Best Price Guarantee', description: 'We match any price and offer the lowest rates available for your travel needs.' },
  { icon: FaHeadset, title: '24/7 Customer Support', description: 'Our dedicated support team is always available to help you anytime, anywhere.' },
  { icon: FaCalendarCheck, title: 'Easy Booking', description: 'Book your entire trip in minutes with our seamless and intuitive booking platform.' },
  { icon: FaShieldVirus, title: 'Trusted & Safe', description: 'Your safety and security are our top priorities with verified hotels and services.' },
  { icon: FaHotel, title: 'Handpicked Hotels', description: 'We personally select each hotel to ensure the highest quality and comfort standards.' },
  { icon: FaSmile, title: 'Happy Customers', description: 'Join thousands of satisfied travelers who trust us for their dream vacations.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const WhyChooseUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.06),transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">Why Us</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Why Travel With Us
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We go above and beyond to make your travel experience extraordinary
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="group relative bg-gray-800/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500 overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-amber-400" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-amber-500/5 blur-2xl group-hover:bg-amber-500/10 transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
