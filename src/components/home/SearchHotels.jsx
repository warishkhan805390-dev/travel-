import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaBed, FaCalendarAlt, FaUser, FaSearch } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const featuredHotels = [
  {
    name: 'Grand Hyatt Dubai',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    location: 'Dubai, UAE',
    price: '$299',
    rating: 4.9,
    reviews: 432,
  },
  {
    name: 'Taj Mahal Palace',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    location: 'Mumbai, India',
    price: '$189',
    rating: 4.8,
    reviews: 378,
  },
  {
    name: 'Four Seasons Bali',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    location: 'Bali, Indonesia',
    price: '$349',
    rating: 4.9,
    reviews: 521,
  },
  {
    name: 'The Ritz-Carlton Paris',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    location: 'Paris, France',
    price: '$459',
    rating: 4.7,
    reviews: 265,
  },
];

const SearchHotels = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">Stay</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Find Your Perfect Stay
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            From luxury resorts to boutique hotels, find accommodation that feels like home
          </p>
        </motion.div>

        <motion.div
          className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-gray-700/50 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-1">
              <label className="text-white/60 text-sm font-medium mb-1.5 block">Destination</label>
              <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                <FaBed className="text-amber-400 mr-3" size={16} />
                <input type="text" placeholder="City or Hotel" className="bg-transparent text-white placeholder-white/40 outline-none w-full" />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm font-medium mb-1.5 block">Check In</label>
              <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                <FaCalendarAlt className="text-amber-400 mr-3" size={16} />
                <input type="date" className="bg-transparent text-white outline-none w-full [color-scheme:dark]" />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm font-medium mb-1.5 block">Check Out</label>
              <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                <FaCalendarAlt className="text-amber-400 mr-3" size={16} />
                <input type="date" className="bg-transparent text-white outline-none w-full [color-scheme:dark]" />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm font-medium mb-1.5 block">Guests</label>
              <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                <FaUser className="text-amber-400 mr-3" size={16} />
                <select className="bg-transparent text-white outline-none w-full">
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Guests</option>
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2">
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </motion.div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-8">Featured Hotels</h3>
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {featuredHotels.map((hotel, i) => (
              <motion.div
                key={i}
                className="group bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${hotel.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md rounded-lg px-3 py-1 border border-white/20">
                    <span className="text-amber-400 font-bold">{hotel.rating}</span>
                    <span className="text-white/60 text-xs ml-1">({hotel.reviews})</span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-white font-bold text-lg mb-1">{hotel.name}</h4>
                  <p className="text-gray-400 text-sm mb-3">{hotel.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">
                      {hotel.price}
                      <span className="text-sm text-gray-400 font-normal"> / night</span>
                    </span>
                    <button className="text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                      View Deal
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:hidden">
            <Swiper spaceBetween={16} slidesPerView={1.1} breakpoints={{ 640: { slidesPerView: 1.5 }, 768: { slidesPerView: 2.5 } }}>
              {featuredHotels.map((hotel, i) => (
                <SwiperSlide key={i}>
                  <div className="group bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700/50">
                    <div className="relative h-44 overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${hotel.image}')` }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md rounded-lg px-3 py-1 border border-white/20">
                        <span className="text-amber-400 font-bold">{hotel.rating}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-bold text-base">{hotel.name}</h4>
                      <p className="text-gray-400 text-xs mb-2">{hotel.location}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-white">{hotel.price}<span className="text-xs text-gray-400 font-normal"> / night</span></span>
                        <button className="text-xs text-amber-400 hover:text-amber-300 font-semibold">View Deal</button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchHotels;
