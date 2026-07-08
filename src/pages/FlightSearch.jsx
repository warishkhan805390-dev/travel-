import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
  FaPlane, FaPlaneDeparture, FaPlaneArrival, FaExchangeAlt, FaUserFriends,
  FaChair, FaClock, FaSuitcase, FaCoffee, FaWifi, FaUsb, FaFilter,
  FaSearch, FaTimes, FaStar, FaChevronLeft, FaChevronRight, FaMinus, FaPlus,
  FaCalendarAlt
} from 'react-icons/fa'
import { formatCurrency } from '../utils/helpers'
import Loader from '../components/common/Loader'
import toast from 'react-hot-toast'

const tripTypes = [
  { id: 'one-way', label: 'One Way' },
  { id: 'round-trip', label: 'Round Trip' },
  { id: 'multi-city', label: 'Multi City' },
]

const seatClasses = ['Economy', 'Premium Economy', 'Business', 'First Class']

const airlines = [
  'Emirates', 'Qatar Airways', 'Singapore Airlines', 'British Airways',
  'Air India', 'Lufthansa', 'Delta', 'United Airlines', 'Etihad', 'Turkish Airlines'
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function FlightSearch() {
  const [tripType, setTripType] = useState('one-way')
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: { adults: 1, children: 0, infants: 0 },
    seatClass: 'Economy',
  })

  const [multiCitySegments, setMultiCitySegments] = useState([
    { from: '', to: '', departureDate: '' },
  ])

  const [sortBy, setSortBy] = useState('price')
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const flightsPerPage = 6

  const [filters, setFilters] = useState({
    airlines: [],
    maxPrice: 5000,
    stops: [],
    departureTime: '',
    arrivalTime: '',
  })

  useEffect(() => {
    if (searchForm.from && searchForm.to && searchForm.departureDate) {
      searchFlights()
    }
  }, [])

  const searchFlights = async () => {
    try {
      setLoading(true)
      setError(null)
      setSearched(true)
      const { data } = await axios.get('/api/flights', {
        params: {
          from: searchForm.from,
          to: searchForm.to,
          date: searchForm.departureDate,
          passengers: searchForm.passengers.adults + searchForm.passengers.children,
          class: searchForm.seatClass,
        },
      })
      setFlights(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'No flights found')
      setFlights([])
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = () => {
    setSearchForm(f => ({ ...f, from: f.to, to: f.from }))
  }

  const addSegment = () => {
    if (multiCitySegments.length < 5) {
      setMultiCitySegments(prev => [...prev, { from: '', to: '', departureDate: '' }])
    }
  }

  const removeSegment = (index) => {
    setMultiCitySegments(prev => prev.filter((_, i) => i !== index))
  }

  const updateSegment = (index, field, value) => {
    setMultiCitySegments(prev => prev.map((seg, i) => i === index ? { ...seg, [field]: value } : seg))
  }

  const filteredFlights = flights.filter((f) => {
    const matchesAirline = filters.airlines.length === 0 || filters.airlines.includes(f.airline)
    const matchesPrice = (f.price || 0) <= filters.maxPrice
    const matchesStops = filters.stops.length === 0 || filters.stops.includes(f.stops)
    return matchesAirline && matchesPrice && matchesStops
  })

  const sortedFlights = [...filteredFlights].sort((a, b) => {
    switch (sortBy) {
      case 'price': return (a.price || 0) - (b.price || 0)
      case 'duration': return (a.duration || 0) - (b.duration || 0)
      case 'departure': return (a.departureTime || '').localeCompare(b.departureTime || '')
      case 'arrival': return (a.arrivalTime || '').localeCompare(b.arrivalTime || '')
      default: return 0
    }
  })

  const totalPages = Math.ceil(sortedFlights.length / flightsPerPage)
  const indexOfLast = currentPage * flightsPerPage
  const indexOfFirst = indexOfLast - flightsPerPage
  const currentFlights = sortedFlights.slice(indexOfFirst, indexOfLast)

  const toggleAirline = (airline) => {
    setFilters(f => ({
      ...f,
      airlines: f.airlines.includes(airline) ? f.airlines.filter(a => a !== airline) : [...f.airlines, airline],
    }))
    setCurrentPage(1)
  }

  const toggleStop = (stop) => {
    setFilters(f => ({
      ...f,
      stops: f.stops.includes(stop) ? f.stops.filter(s => s !== stop) : [...f.stops, stop],
    }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({ airlines: [], maxPrice: 5000, stops: [], departureTime: '', arrivalTime: '' })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (tripType === 'multi-city') {
      const valid = multiCitySegments.every(s => s.from && s.to && s.departureDate)
      if (!valid) { toast.error('Please fill all multi-city segments'); return }
    } else {
      if (!searchForm.from || !searchForm.to) { toast.error('Please enter departure and arrival cities'); return }
      if (!searchForm.departureDate) { toast.error('Please select a departure date'); return }
    }
    searchFlights()
  }

  const passengerTotal = searchForm.passengers.adults + searchForm.passengers.children + searchForm.passengers.infants

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaFilter className="text-primary-500" />
          Filters
        </h3>
        {(filters.airlines.length > 0 || filters.stops.length > 0 || filters.maxPrice < 5000) && (
          <button onClick={clearFilters} className="text-sm text-primary-500 hover:text-primary-600">Clear All</button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Airlines</label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {airlines.map(a => (
            <label key={a} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.airlines.includes(a)}
                onChange={() => toggleAirline(a)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{a}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Max Price: ${filters.maxPrice}
        </label>
        <input
          type="range" min={0} max={5000} value={filters.maxPrice}
          onChange={(e) => { setFilters(f => ({ ...f, maxPrice: Number(e.target.value) })); setCurrentPage(1) }}
          className="w-full accent-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stops</label>
        <div className="space-y-2">
          {[
            { value: 0, label: 'Direct' },
            { value: 1, label: '1 Stop' },
            { value: 2, label: '2+ Stops' },
          ].map(s => (
            <label key={s.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.stops.includes(s.value)}
                onChange={() => toggleStop(s.value)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{s.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative pt-32 pb-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109c609?w=1920')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Find Your Flight</h1>
            <p className="text-gray-300 text-lg">Search and compare flights at the best prices</p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            {/* Trip Type Tabs */}
            <div className="flex gap-2 mb-6">
              {tripTypes.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTripType(t.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    tripType === t.id
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tripType === 'multi-city' ? (
              <div className="space-y-4">
                {multiCitySegments.map((seg, i) => (
                  <div key={i} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">From</label>
                      <input type="text" value={seg.from} onChange={(e) => updateSegment(i, 'from', e.target.value)}
                        placeholder="City or Airport" className="input-field" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">To</label>
                      <input type="text" value={seg.to} onChange={(e) => updateSegment(i, 'to', e.target.value)}
                        placeholder="City or Airport" className="input-field" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
                      <input type="date" value={seg.departureDate} onChange={(e) => updateSegment(i, 'departureDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]} className="input-field" />
                    </div>
                    {multiCitySegments.length > 1 && (
                      <button onClick={() => removeSegment(i)}
                        className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
                {multiCitySegments.length < 5 && (
                  <button onClick={addSegment} className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                    + Add Another City
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="flex-1 relative">
                    <FaPlaneDeparture className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={searchForm.from} onChange={(e) => setSearchForm(f => ({ ...f, from: e.target.value }))}
                      placeholder="From (City or Airport)" className="input-field pl-10" />
                  </div>
                  <button onClick={handleSwap}
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-500 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-all">
                    <FaExchangeAlt />
                  </button>
                  <div className="flex-1 relative">
                    <FaPlaneArrival className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={searchForm.to} onChange={(e) => setSearchForm(f => ({ ...f, to: e.target.value }))}
                      placeholder="To (City or Airport)" className="input-field pl-10" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      <FaCalendarAlt className="inline mr-1" />
                      Departure
                    </label>
                    <input type="date" value={searchForm.departureDate}
                      onChange={(e) => setSearchForm(f => ({ ...f, departureDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]} className="input-field" />
                  </div>
                  {tripType === 'round-trip' && (
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        <FaCalendarAlt className="inline mr-1" />
                        Return
                      </label>
                      <input type="date" value={searchForm.returnDate}
                        onChange={(e) => setSearchForm(f => ({ ...f, returnDate: e.target.value }))}
                        min={searchForm.departureDate || new Date().toISOString().split('T')[0]} className="input-field" />
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      <FaUserFriends className="inline mr-1" />
                      Passengers
                    </label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSearchForm(f => ({ ...f, passengers: { ...f.passengers, adults: Math.max(1, f.passengers.adults - 1) } }))}
                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                        <FaMinus size={10} />
                      </button>
                      <span className="text-sm font-medium text-gray-900 dark:text-white px-2">{passengerTotal}</span>
                      <button onClick={() => setSearchForm(f => ({ ...f, passengers: { ...f.passengers, adults: f.passengers.adults + 1 } }))}
                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      <FaChair className="inline mr-1" />
                      Class
                    </label>
                    <select value={searchForm.seatClass}
                      onChange={(e) => setSearchForm(f => ({ ...f, seatClass: e.target.value }))}
                      className="input-field">
                      {seatClasses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <button onClick={handleSearch}
              className="w-full mt-6 py-4 gradient-bg text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2">
              <FaSearch /> Search Flights
            </button>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {!searched ? null : loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FaPlane className="text-4xl text-gray-400 transform -rotate-45" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Flights Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            <button onClick={searchFlights} className="btn-primary">Try Again</button>
          </motion.div>
        ) : flights.length === 0 ? null : (
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Desktop Filter */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24 glass-card p-6">
                  <FilterSidebar />
                </div>
              </aside>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Found <span className="font-semibold text-gray-900 dark:text-white">{sortedFlights.length}</span> flights
                  </p>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-sm text-gray-700 dark:text-gray-300 focus:outline-none">
                        <option value="price">Price</option>
                        <option value="duration">Duration</option>
                        <option value="departure">Departure</option>
                        <option value="arrival">Arrival</option>
                      </select>
                    </div>
                    <button onClick={() => setShowMobileFilter(true)} className="lg:hidden px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300">
                      <FaFilter />
                    </button>
                  </div>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {currentFlights.map((flight) => (
                      <motion.div
                        key={flight._id}
                        layout
                        variants={cardVariants}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group card p-6 hover:shadow-xl transition-all duration-500"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                          <div className="text-center sm:text-left">
                            <img
                              src={flight.airlineLogo || `https://via.placeholder.com/60x60/3b82f6/ffffff?text=${(flight.airline || 'FL').charAt(0)}`}
                              alt={flight.airline}
                              className="w-14 h-14 object-contain rounded-xl bg-gray-50 dark:bg-gray-700 p-2"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{flight.airline}</p>
                            <p className="text-xs font-mono text-gray-400">{flight.flightNumber}</p>
                          </div>

                          <div className="flex-1 flex items-center gap-4 sm:gap-8 w-full">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">{flight.departureTime || '06:00'}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{flight.from || searchForm.from}</div>
                            </div>

                            <div className="flex-1 relative px-4">
                              <div className="text-center">
                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                  flight.stops === 0
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                    : flight.stops === 1
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                }`}>
                                  <FaClock size={10} />
                                  {flight.duration ? `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m` : '2h 30m'}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {flight.stops === 0 ? 'Direct' : flight.stops === 1 ? '1 Stop' : `${flight.stops} Stops`}
                                </p>
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">{flight.arrivalTime || '08:30'}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{flight.to || searchForm.to}</div>
                            </div>
                          </div>

                          <div className="text-right w-full sm:w-auto">
                            <div className="text-2xl font-bold gradient-text">{formatCurrency(flight.price || 299)}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{searchForm.seatClass}</div>
                            <div className="flex items-center justify-end gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              {flight.amenities?.includes('meal') && <FaCoffee />}
                              {flight.amenities?.includes('wifi') && <FaWifi />}
                              {flight.amenities?.includes('usb') && <FaUsb />}
                              {flight.baggage && <span className="flex items-center gap-1"><FaSuitcase size={10} />{flight.baggage}</span>}
                            </div>
                            <button className="mt-3 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 w-full sm:w-auto">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
