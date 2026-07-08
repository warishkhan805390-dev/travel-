import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
  FaCar, FaGasPump, FaCogs, FaUsers, FaSnowflake, FaBluetooth,
  FaMapMarkerAlt, FaStar, FaClock, FaFilter, FaSearch, FaTimes,
  FaChevronLeft, FaChevronRight, FaCalendarAlt, FaSort, FaTachometerAlt,
  FaMapPin, FaGlobeAmericas
} from 'react-icons/fa'
import { formatCurrency } from '../utils/helpers'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

const carTypes = ['SUV', 'Sedan', 'Luxury', 'Hatchback', 'Convertible', 'Electric', 'Van', 'Truck']
const transmissions = ['Automatic', 'Manual']
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid']
const seatOptions = [2, 4, 5, 6, 7, 8]

const quickTypes = [
  { type: 'SUV', icon: FaCar, color: 'from-blue-500 to-blue-600' },
  { type: 'Sedan', icon: FaCar, color: 'from-gray-500 to-gray-600' },
  { type: 'Luxury', icon: FaCar, color: 'from-amber-500 to-amber-600' },
  { type: 'Hatchback', icon: FaCar, color: 'from-green-500 to-green-600' },
]

const featureIcons = {
  ac: { icon: FaSnowflake, label: 'AC' },
  bluetooth: { icon: FaBluetooth, label: 'Bluetooth' },
  gps: { icon: FaGlobeAmericas, label: 'GPS' },
  sunroof: { icon: FaMapPin, label: 'Sunroof' },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function CarRental() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)
  const [driverIncluded, setDriverIncluded] = useState(false)

  const [searchForm, setSearchForm] = useState({
    location: '',
    pickupDate: '',
    pickupTime: '10:00',
    dropDate: '',
    dropTime: '10:00',
  })

  const [sortBy, setSortBy] = useState('price')
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const carsPerPage = 8

  const [filters, setFilters] = useState({
    carType: [],
    transmission: '',
    minSeats: 0,
    minPrice: 0,
    maxPrice: 500,
    fuelType: [],
  })

  useEffect(() => {
    if (searchForm.location) {
      searchCars()
    }
  }, [])

  const searchCars = async () => {
    try {
      setLoading(true)
      setError(null)
      setSearched(true)
      const { data } = await axios.get('/api/cars', {
        params: { location: searchForm.location },
      })
      setCars(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'No cars available')
      setCars([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchForm.location) { toast.error('Please enter pickup location'); return }
    if (!searchForm.pickupDate) { toast.error('Please select pickup date'); return }
    searchCars()
  }

  const filteredCars = cars.filter((car) => {
    const matchesType = filters.carType.length === 0 || filters.carType.includes(car.type)
    const matchesTransmission = !filters.transmission || car.transmission === filters.transmission
    const matchesSeats = !filters.minSeats || (car.seats || 0) >= filters.minSeats
    const matchesPrice = (car.price || 0) >= filters.minPrice && (car.price || 0) <= filters.maxPrice
    const matchesFuel = filters.fuelType.length === 0 || filters.fuelType.includes(car.fuelType)
    return matchesType && matchesTransmission && matchesSeats && matchesPrice && matchesFuel
  })

  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'price': return (a.price || 0) - (b.price || 0)
      case 'price-desc': return (b.price || 0) - (a.price || 0)
      case 'rating': return (b.rating || 0) - (a.rating || 0)
      case 'name': return (a.name || '').localeCompare(b.name || '')
      default: return 0
    }
  })

  const totalPages = Math.ceil(sortedCars.length / carsPerPage)
  const indexOfLast = currentPage * carsPerPage
  const indexOfFirst = indexOfLast - carsPerPage
  const currentCars = sortedCars.slice(indexOfFirst, indexOfLast)

  const toggleFilterArray = (arr, value) =>
    arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]

  const clearFilters = () => {
    setFilters({ carType: [], transmission: '', minSeats: 0, minPrice: 0, maxPrice: 500, fuelType: [] })
  }

  const hasActiveFilters = filters.carType.length > 0 || filters.transmission || filters.fuelType.length > 0 ||
    filters.minSeats > 0 || filters.minPrice > 0 || filters.maxPrice < 500

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaFilter className="text-primary-500" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-primary-500 hover:text-primary-600">Clear All</button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Car Type</label>
        <div className="space-y-2">
          {carTypes.map(type => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.carType.includes(type)}
                onChange={() => setFilters(f => ({ ...f, carType: toggleFilterArray(f.carType, type) }))}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transmission</label>
        <div className="flex gap-2">
          {transmissions.map(t => (
            <button
              key={t}
              onClick={() => setFilters(f => ({ ...f, transmission: f.transmission === t ? '' : t }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filters.transmission === t
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Seats</label>
        <div className="flex flex-wrap gap-2">
          {seatOptions.map(s => (
            <button
              key={s}
              onClick={() => setFilters(f => ({ ...f, minSeats: f.minSeats === s ? 0 : s }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filters.minSeats === s
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {s}+
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Price Range: ${filters.minPrice} - ${filters.maxPrice}
        </label>
        <div className="space-y-2">
          <input type="range" min={0} max={500} value={filters.minPrice}
            onChange={(e) => setFilters(f => ({ ...f, minPrice: Number(e.target.value) }))}
            className="w-full accent-primary-500" />
          <input type="range" min={0} max={500} value={filters.maxPrice}
            onChange={(e) => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
            className="w-full accent-primary-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fuel Type</label>
        <div className="flex flex-wrap gap-2">
          {fuelTypes.map(fuel => (
            <button
              key={fuel}
              onClick={() => setFilters(f => ({ ...f, fuelType: toggleFilterArray(f.fuelType, fuel) }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filters.fuelType.includes(fuel)
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {fuel}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative pt-32 pb-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Rent a Car</h1>
            <p className="text-gray-300 text-lg">Explore your destination with the freedom of your own wheels</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={searchForm.location}
                  onChange={(e) => setSearchForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Pickup location (city or airport)" className="input-field pl-12" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <FaCalendarAlt className="inline mr-1" /> Pickup Date
                  </label>
                  <input type="date" value={searchForm.pickupDate}
                    onChange={(e) => setSearchForm(f => ({ ...f, pickupDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <FaClock className="inline mr-1" /> Pickup Time
                  </label>
                  <input type="time" value={searchForm.pickupTime}
                    onChange={(e) => setSearchForm(f => ({ ...f, pickupTime: e.target.value }))}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <FaCalendarAlt className="inline mr-1" /> Drop Date
                  </label>
                  <input type="date" value={searchForm.dropDate}
                    onChange={(e) => setSearchForm(f => ({ ...f, dropDate: e.target.value }))}
                    min={searchForm.pickupDate || new Date().toISOString().split('T')[0]} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <FaClock className="inline mr-1" /> Drop Time
                  </label>
                  <input type="time" value={searchForm.dropTime}
                    onChange={(e) => setSearchForm(f => ({ ...f, dropTime: e.target.value }))}
                    className="input-field" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={driverIncluded}
                    onChange={(e) => setDriverIncluded(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Include Driver</span>
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400">(Additional $20/day)</span>
              </div>

              <button type="submit"
                className="w-full py-4 gradient-bg text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2">
                <FaSearch /> Search Cars
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Quick Select */}
      {searched && !loading && sortedCars.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {quickTypes.map(qt => (
              <button
                key={qt.type}
                onClick={() => setFilters(f => ({
                  ...f,
                  carType: f.carType.includes(qt.type) ? [] : [qt.type],
                }))}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                  filters.carType.includes(qt.type)
                    ? `bg-gradient-to-r ${qt.color} text-white shadow-lg`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md hover:shadow-lg'
                }`}
              >
                <qt.icon />
                {qt.type}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {!searched ? null : loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <Loader key={i} type="card" />)}
          </div>
        ) : error ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FaCar className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Cars Available</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            <button onClick={searchCars} className="btn-primary">Try Again</button>
          </motion.div>
        ) : sortedCars.length === 0 ? null : (
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 glass-card p-6">
                  <FilterSidebar />
                </div>
              </aside>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Found <span className="font-semibold text-gray-900 dark:text-white">{sortedCars.length}</span> cars
                  </p>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <FaSort className="text-gray-400" />
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-sm text-gray-700 dark:text-gray-300 focus:outline-none">
                        <option value="price">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Rating</option>
                        <option value="name">Name</option>
                      </select>
                    </div>
                    <button onClick={() => setShowMobileFilter(true)} className="lg:hidden px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300">
                      <FaFilter />
                    </button>
                  </div>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {currentCars.map((car) => {
                      const features = car.features || ['ac', 'bluetooth', 'gps']
                      return (
                        <motion.div
                          key={car._id}
                          layout
                          variants={cardVariants}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="group card p-0 hover:shadow-xl transition-all duration-500"
                        >
                          <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img
                              src={car.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400'}
                              alt={car.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold shadow-lg">
                              {car.type || 'SUV'}
                            </span>
                            {car.rating && (
                              <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/90 text-sm font-bold text-amber-500 flex items-center gap-1 shadow-lg">
                                <FaStar size={12} /> {car.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{car.name || car.brand}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                              <FaMapMarkerAlt size={10} className="text-primary-500" />
                              {car.location || searchForm.location}
                            </p>

                            <div className="grid grid-cols-2 gap-2 mb-4">
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                                <FaCogs className="text-accent-500" />
                                {car.transmission || 'Automatic'}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                                <FaUsers className="text-accent-500" />
                                {car.seats || 5} Seats
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                                <FaGasPump className="text-accent-500" />
                                {car.fuelType || 'Petrol'}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
                                <FaTachometerAlt className="text-accent-500" />
                                {car.mileage || '15 km/l'}
                              </div>
                            </div>

                            <div className="flex gap-2 mb-4">
                              {features.slice(0, 4).map((f, i) => {
                                const feat = featureIcons[f]
                                return feat ? (
                                  <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                    <feat.icon size={10} />
                                    {feat.label}
                                  </span>
                                ) : null
                              })}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                              <div>
                                <span className="text-2xl font-bold gradient-text">
                                  {formatCurrency(car.price || 50)}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/ day</span>
                                {driverIncluded && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">+ $20 driver fee</p>
                                )}
                              </div>
                              <button className="px-4 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300">
                                Rent Now
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                      className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      <FaChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i + 1} onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all ${
                          currentPage === i + 1
                            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                            : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Filter */}
            <AnimatePresence>
              {showMobileFilter && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden">
                  <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilter(false)} />
                  <motion.div
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                        <button onClick={() => setShowMobileFilter(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <FaTimes size={20} />
                        </button>
                      </div>
                      <FilterSidebar />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </section>
    </motion.div>
  )
}
