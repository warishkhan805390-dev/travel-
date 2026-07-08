import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { IoLocationSharp } from 'react-icons/io5';
import { FiArrowRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const destinations = [
  { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', tours: 24 },
  { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', tours: 18 },
  { name: 'Maldives', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', tours: 15 },
  { name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', tours: 30 },
  { name: 'Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800', tours: 22 },
  { name: 'India', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', tours: 20 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const FeaturedDestinations = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(251,146,60,0.08),transparent_50%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">Explore</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Featured Destinations
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Handpicked destinations that promise unforgettable experiences and breathtaking beauty
          </p>
        </motion.div>

        <div className="hidden lg:block">
          <motion.div
            className="grid grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {destinations.map((dest, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="group relative rounded-3xl overflow-hidden cursor-pointer h-80"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${dest.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-white text-sm font-medium border border-white/20">
                  {dest.tours} Tours
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-white">
                    <IoLocationSharp className="text-amber-400" size={20} />
                    <h3 className="text-xl font-bold">{dest.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="lg:hidden">
          <Swiper
            spaceBetween={16}
            slidesPerView={1.1}
            centeredSlides={false}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2.2 },
            }}
          >
            {destinations.map((dest, i) => (
              <SwiperSlide key={i}>
                <div className="group relative rounded-3xl overflow-hidden cursor-pointer h-72">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${dest.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-white text-sm font-medium border border-white/20">
                    {dest.tours} Tours
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 text-white">
                      <IoLocationSharp className="text-amber-400" size={20} />
                      <h3 className="text-xl font-bold">{dest.name}</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-orange-500/30">
            View All Destinations
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
