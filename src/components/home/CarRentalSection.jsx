import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaCar, FaGasPump, FaCogs, FaUsers, FaSnowflake } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const carTypes = ['All', 'SUV', 'Sedan', 'Luxury', 'Hatchback'];

const cars = [
  {
    name: 'Toyota Fortuner',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    features: { fuel: 'Diesel', transmission: 'Automatic', seats: 7, ac: true },
    price: 89,
  },
  {
    name: 'Mercedes-Benz S-Class',
    type: 'Luxury',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    features: { fuel: 'Petrol', transmission: 'Automatic', seats: 5, ac: true },
    price: 249,
  },
  {
    name: 'Honda Civic',
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    features: { fuel: 'Petrol', transmission: 'Automatic', seats: 5, ac: true },
    price: 69,
  },
  {
    name: 'Maruti Swift',
    type: 'Hatchback',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
    features: { fuel: 'Petrol', transmission: 'Manual', seats: 5, ac: true },
    price: 49,
  },
  {
    name: 'Range Rover Sport',
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    features: { fuel: 'Diesel', transmission: 'Automatic', seats: 7, ac: true },
    price: 199,
  },
  {
    name: 'BMW 7 Series',
    type: 'Luxury',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    features: { fuel: 'Petrol', transmission: 'Automatic', seats: 5, ac: true },
    price: 279,
  },
];

const CarRentalSection = () => {
  const [activeType, setActiveType] = useState('All');
  const [withDriver, setWithDriver] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const filteredCars = activeType === 'All' ? cars : cars.filter((c) => c.type === activeType);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">Drive</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">Rent A Car</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Explore destinations at your own pace with our premium car rental service
          </p>
        </motion.div>

        <motion.div
          className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-gray-700/50 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-white/60 text-sm font-medium mb-1.5 block">Pickup Location</label>
              <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                <FaCar className="text-amber-400 mr-3 shrink-0" size={16} />
                <input type="text" placeholder="City or Airport" className="bg-transparent text-white placeholder-white/40 outline-none w-full" />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm font-medium mb-1.5 block">Pickup Date</label>
              <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                <input type="date" className="bg-transparent text-white outline-none w-full [color-scheme:dark]" />
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm font-medium mb-1.5 block">Drop Date</label>
              <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                <input type="date" className="bg-transparent text-white outline-none w-full [color-scheme:dark]" />
              </div>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/30">
                Search Cars
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-700/50">
            <div className="flex flex-wrap gap-2">
              {carTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeType === type
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-white/60 text-sm">With Driver</span>
              <div
                onClick={() => setWithDriver(!withDriver)}
                className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${
                  withDriver ? 'bg-amber-500' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    withDriver ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </label>
          </div>
        </motion.div>

        <div className="hidden lg:grid grid-cols-3 gap-6">
          {filteredCars.map((car, i) => (
            <motion.div
              key={i}
              className="group bg-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/50 hover:border-amber-500/30 transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative h-52 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${car.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-white text-sm font-medium border border-white/20">
                  {car.type}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-3">{car.name}</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaGasPump className="text-amber-400" size={14} /> {car.features.fuel}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaCogs className="text-amber-400" size={14} /> {car.features.transmission}
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaUsers className="text-amber-400" size={14} /> {car.features.seats} Seats
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FaSnowflake className="text-amber-400" size={14} /> {car.features.ac ? 'AC' : 'Non-AC'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-white">${car.price}</span>
                    <span className="text-gray-400 text-sm"> / day</span>
                  </div>
                  <button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/30">
                    Rent Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:hidden">
          <Swiper spaceBetween={16} slidesPerView={1.1} breakpoints={{ 640: { slidesPerView: 1.5 }, 768: { slidesPerView: 2.2 } }}>
            {filteredCars.map((car, i) => (
              <SwiperSlide key={i}>
                <div className="group bg-gray-800/50 rounded-3xl overflow-hidden border border-gray-700/50">
                  <div className="relative h-44 overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${car.image}')` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-white text-sm font-medium border border-white/20">{car.type}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{car.name}</h3>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs"><FaGasPump className="text-amber-400" size={12} />{car.features.fuel}</div>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs"><FaCogs className="text-amber-400" size={12} />{car.features.transmission}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">${car.price}<span className="text-xs text-gray-400">/day</span></span>
                      <button className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-semibold">Rent Now</button>
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

export default CarRentalSection;
