import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaPlane, FaPlaneDeparture, FaPlaneArrival, FaExchangeAlt, FaUserFriends, FaChair } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

const tabs = ['One Way', 'Round Trip', 'Multi City'];

const popularRoutes = [
  { from: 'New York', to: 'Dubai', price: '$599' },
  { from: 'London', to: 'Paris', price: '$129' },
  { from: 'Dubai', to: 'Maldives', price: '$349' },
  { from: 'Mumbai', to: 'Bali', price: '$289' },
  { from: 'Paris', to: 'Bangkok', price: '$459' },
  { from: 'Singapore', to: 'Tokyo', price: '$389' },
];

const FlightSearchSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-amber-400 font-semibold tracking-wider uppercase text-sm">Flights</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
            Book Your Flights
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Find the best flight deals to destinations worldwide
          </p>
        </motion.div>

        <motion.div
          className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-gray-700/50"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex gap-2 mb-8">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === i
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <label className="text-white/60 text-sm font-medium mb-1.5 block">From</label>
              <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                <FaPlaneDeparture className="text-amber-400 mr-3 shrink-0" size={16} />
                <input type="text" placeholder="Departure City" className="bg-transparent text-white placeholder-white/40 outline-none w-full" />
              </div>
            </div>

            <div className="relative flex items-end">
              <div className="w-full">
                <label className="text-white/60 text-sm font-medium mb-1.5 block">To</label>
                <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                  <FaPlaneArrival className="text-amber-400 mr-3 shrink-0" size={16} />
                  <input type="text" placeholder="Arrival City" className="bg-transparent text-white placeholder-white/40 outline-none w-full" />
                </div>
              </div>
              <motion.button
                className="absolute -right-3 top-1/2 -translate-y-1/2 bg-gray-700 rounded-full p-2 border border-gray-600 hover:bg-gray-600 transition-colors z-10"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <FaExchangeAlt className="text-amber-400" size={14} />
              </motion.button>
            </div>

            <div>
              <label className="text-white/60 text-sm font-medium mb-1.5 block">Depart</label>
              <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                <input type="date" className="bg-transparent text-white outline-none w-full [color-scheme:dark]" />
              </div>
            </div>

            {activeTab !== 0 && (
              <div>
                <label className="text-white/60 text-sm font-medium mb-1.5 block">Return</label>
                <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                  <input type="date" className="bg-transparent text-white outline-none w-full [color-scheme:dark]" />
                </div>
              </div>
            )}

            <div className={activeTab === 0 ? '' : ''}>
              {activeTab === 0 && (
                <div>
                  <label className="text-white/60 text-sm font-medium mb-1.5 block">Return</label>
                  <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                    <input type="date" className="bg-transparent text-white outline-none w-full [color-scheme:dark]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div>
              <label className="text-white/60 text-sm font-medium mb-1.5 block">Passengers</label>
              <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                <FaUserFriends className="text-amber-400 mr-3 shrink-0" size={16} />
                <select className="bg-transparent text-white outline-none w-full">
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>2 Adults, 1 Child</option>
                  <option>2 Adults, 2 Children</option>
                  <option>2 Adults, 1 Child, 1 Infant</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-white/60 text-sm font-medium mb-1.5 block">Class</label>
              <div className="flex items-center bg-gray-700/50 rounded-xl px-4 py-3 border border-gray-600/50 focus-within:border-amber-500/50 transition-colors">
                <FaChair className="text-amber-400 mr-3 shrink-0" size={16} />
                <select className="bg-transparent text-white outline-none w-full">
                  <option>Economy</option>
                  <option>Premium Economy</option>
                  <option>Business</option>
                  <option>First Class</option>
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2">
                <FiSearch size={18} />
                Search Flights
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-4 text-center">Popular Routes</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {popularRoutes.map((route, i) => (
              <motion.button
                key={i}
                className="group bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-amber-500/30 rounded-full px-5 py-2.5 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-white font-medium">{route.from}</span>
                <FaPlane className="text-amber-400 mx-2 inline text-xs" />
                <span className="text-white font-medium">{route.to}</span>
                <span className="ml-2 text-amber-400 font-semibold">{route.price}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FlightSearchSection;
