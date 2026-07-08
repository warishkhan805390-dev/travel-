import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaStar, FaClock, FaUserFriends } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const tours = [
  {
    title: 'Tropical Paradise Escape',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    category: 'Beach',
    duration: '7 Days',
    price: '$1,299',
    rating: 4.8,
    reviews: 256,
    groupSize: 'Up to 12',
    discount: 20,
  },
  {
    title: 'Cultural Heritage Tour',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    category: 'Cultural',
    duration: '10 Days',
    price: '$1,899',
    rating: 4.9,
    reviews: 189,
    groupSize: 'Up to 15',
    discount: 15,
  },
  {
    title: 'Desert Safari Adventure',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    category: 'Adventure',
    duration: '5 Days',
    price: '$899',
    rating: 4.7,
    reviews: 312,
    groupSize: 'Up to 10',
    discount: 10,
  },
  {
    title: 'Romantic Getaway Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    category: 'Romantic',
    duration: '6 Days',
    price: '$2,199',
    rating: 4.9,
    reviews: 178,
    groupSize: 'Up to 8',
    discount: 25,
  },
  {
    title: 'Temple & Nature Thailand',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    category: 'Nature',
    duration: '8 Days',
    price: '$1,099',
    rating: 4.6,
    reviews: 245,
    groupSize: 'Up to 14',
    discount: 18,
  },
  {
    title: 'Bali Wellness Retreat',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    category: 'Wellness',
    duration: '5 Days',
    price: '$1,599',
    rating: 4.8,
    reviews: 167,
    groupSize: 'Up to 10',
    discount: 12,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const PopularTours = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">Tours</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Most Popular Tour Packages
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Curated experiences designed to give you the best of every destination
          </p>
        </motion.div>

        <div className="hidden lg:block">
          <motion.div
            className="grid grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {tours.map((tour, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500"
                whileHover={{ y: -8 }}
              >
                <div className="relative h-52 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${tour.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {tour.category}
                  </div>
                  {tour.discount && (
                    <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      -{tour.discount}%
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 text-white/80 text-sm">
                      <FaStar className="text-amber-400" size={14} />
                      <span className="font-medium">{tour.rating}</span>
                      <span className="text-white/50">({tour.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                    {tour.title}
                  </h3>
                  <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                    <span className="flex items-center gap-1.5">
                      <FaClock size={14} />
                      {tour.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FaUserFriends size={14} />
                      {tour.groupSize}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      {tour.price}
                      <span className="text-sm text-gray-400 font-normal"> / person</span>
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold">
                      Book Now
                    </button>
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
            breakpoints={{
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2.2 },
            }}
          >
            {tours.map((tour, i) => (
              <SwiperSlide key={i}>
                <div className="group bg-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/50">
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${tour.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {tour.category}
                    </div>
                    {tour.discount && (
                      <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        -{tour.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-3">{tour.title}</h3>
                    <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                      <span className="flex items-center gap-1.5"><FaClock size={14} />{tour.duration}</span>
                      <span className="flex items-center gap-1.5"><FaUserFriends size={14} />{tour.groupSize}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">{tour.price}<span className="text-sm text-gray-400 font-normal"> / person</span></span>
                      <button className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold">Book Now</button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default PopularTours;
