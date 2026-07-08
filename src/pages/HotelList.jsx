import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
  FaMapMarkerAlt, FaStar, FaBed, FaWifi, FaSwimmingPool, FaSpa, FaDumbbell,
  FaParking, FaUtensils, FaSearch, FaFilter, FaTimes, FaChevronLeft, FaChevronRight,
  FaHeart, FaEye, FaSort, FaMapMarkedAlt, FaTh
} from 'react-icons/fa'
import { formatCurrency, getImageUrl } from '../utils/helpers'
import Loader from '../components/common/Loader'
import MapView from '../components/common/MapView'
import { useWishlist } from '../context/WishlistContext'
import toast from 'react-hot-toast'

const starRatings = [5, 4, 3, 2, 1]
const amenitiesList = [
  { key: 'pool', label: 'Pool', icon: FaSwimmingPool },
  { key: 'spa', label: 'Spa', icon: FaSpa },
  { key: 'gym', label: 'Gym', icon: FaDumbbell },
  { key: 'restaurant', label: 'Restaurant', icon: FaUtensils },
  { key: 'wifi', label: 'WiFi', icon: FaWifi },
  { key: 'parking', label: 'Parking', icon: FaParking },
]
const propertyTypes = ['Hotel', 'Resort', 'Villa', 'Apartment', 'Guest House', 'Boutique']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.06 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function HotelList() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [viewMode, setViewMode] = useState('list')
  const hotelsPerPage = 9

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 2000,
    stars: [],
    amenities: [],
    propertyType: '',
  })

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/hotels')
      setHotels(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hotels')
    } finally {
      setLoading(false)
    }
  }

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = hotel.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.city?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = (hotel.price || 0) >= filters.minPrice && (hotel.price || 0) <= filters.maxPrice
    const matchesStars = filters.stars.length === 0 || filters.stars.includes(hotel.stars)
    const matchesAmenities = filters.amenities.length === 0 || filters.amenities.every(a => hotel.amenities?.includes(a))
    const matchesType = !filters.propertyType || hotel.type === filters.propertyType
    return matchesSearch && matchesPrice && matchesStars && matchesAmenities && matchesType
  })

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return (a.price || 0) - (b.price || 0)
      case 'price-high': return (b.price || 0) - (a.price || 0)
      case 'rating': return (b.rating || 0) - (a.rating || 0)
      case 'name': return (a.name || '').localeCompare(b.name || '')
      default: return (b.popularity || 0) - (a.popularity || 0)
    }
  })

  const totalPages = Math.ceil(sortedHotels.length / hotelsPerPage)
  const indexOfLast = currentPage * hotelsPerPage
  const indexOfFirst = indexOfLast - hotelsPerPage
  const currentHotels = sortedHotels.slice(indexOfFirst, indexOfLast)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleStar = (star) => {
    setFilters(f => ({
      ...f,
      stars: f.stars.includes(star) ? f.stars.filter(s => s !== star) : [...f.stars, star],
    }))
    setCurrentPage(1)
  }

  const toggleAmenity = (amenity) => {
    setFilters(f => ({
      ...f,
      amenities: f.amenities.includes(amenity) ? f.amenities.filter(a => a !== amenity) : [...f.amenities, amenity],
    }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({ minPrice: 0, maxPrice: 2000, stars: [], amenities: [], propertyType: '' })
    setSearchQuery('')
  }

  const hasActiveFilters = filters.stars.length > 0 || filters.amenities.length > 0 || filters.propertyType ||
    filters.minPrice > 0 || filters.maxPrice < 2000

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FaFilter className="text-primary-500" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-primary-500 hover:text-primary-600 transition-colors">
            Clear All
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Price Range: ${filters.minPrice} - ${filters.maxPrice}
        </label>
        <div className="space-y-2">
          <input type="range" min={0} max={2000} value={filters.minPrice}
            onChange={(e) => { setFilters(f => ({ ...f, minPrice: Number(e.target.value) })); setCurrentPage(1) }}
            className="w-full accent-primary-500" />
          <input type="range" min={0} max={2000} value={filters.maxPrice}
            onChange={(e) => { setFilters(f => ({ ...f, maxPrice: Number(e.target.value) })); setCurrentPage(1) }}
            className="w-full accent-primary-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Star Rating</label>
        <div className="flex flex-wrap gap-2">
          {starRatings.map(star => (
            <button
              key={star}
              onClick={() => toggleStar(star)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                filters.stars.includes(star)
                  ? 'bg-amber-400 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <FaStar size={12} />
              {star}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</label>
        <div className="space-y-2">
          {amenitiesList.map(a => (
            <label key={a.key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.amenities.includes(a.key)}
                onChange={() => toggleAmenity(a.key)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
              />
              <a.icon className="text-gray-400 group-hover:text-primary-500 transition-colors" size={14} />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                {a.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property Type</label>
        <select
          value={filters.propertyType}
          onChange={(e) => { setFilters(f => ({ ...f, propertyType: e.target.value })); setCurrentPage(1) }}
          className="input-field"
        >
          <option value="">All Types</option>
          {propertyTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
    </div>
  )

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Oops!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button onClick={fetchHotels} className="btn-primary">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Banner */}
      <section className="relative h-64 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-bold text-white mb-4">
            Find Your Perfect Stay
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-300 text-lg">
            Browse through our curated collection of hotels and resorts
          </motion.p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search hotels by name or location..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              className="input-field pl-12"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <FaSort className="text-gray-400" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm text-gray-700 dark:text-gray-300 focus:outline-none">
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className="hidden sm:flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-500' : 'text-gray-500'}`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${viewMode === 'map' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary-500' : 'text-gray-500'}`}
              >
                <FaMapMarkedAlt />
              </button>
            </div>
            <button onClick={() => setShowMobileFilter(true)} className="lg:hidden px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300">
              <FaFilter />
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filter */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 glass-card p-6">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <Loader key={i} type="card" />)}
              </div>
            ) : viewMode === 'map' ? (
              <div className="h-[600px] rounded-2xl overflow-hidden">
                <MapView
                  latitude={20.5937}
                  longitude={78.9629}
                  address="Hotels"
                  height="600px"
                  zoom={5}
                />
              </div>
            ) : currentHotels.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <FaBed className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Hotels Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing <span className="font-semibold">{indexOfFirst + 1}-{Math.min(indexOfLast, sortedHotels.length)}</span> of{' '}
                    <span className="font-semibold">{sortedHotels.length}</span> hotels
                  </p>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {currentHotels.map((hotel) => {
                      const inWishlist = isInWishlist(hotel._id)
                      return (
                        <motion.div
                          key={hotel._id}
                          layout
                          variants={cardVariants}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
                        >
                          <div className="relative overflow-hidden h-48">
                            <img
                              src={getImageUrl(hotel.images?.[0] || hotel.image)}
                              alt={hotel.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-3 left-3 flex gap-1">
                              {Array.from({ length: hotel.stars || 0 }).map((_, i) => (
                                <FaStar key={i} className="text-amber-400 drop-shadow-lg" size={14} />
                              ))}
                            </div>
                            {hotel.rating && (
                              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-sm font-bold text-primary-600 shadow-lg">
                                {hotel.rating.toFixed(1)}
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                              <Link to={`/hotels/${hotel.slug}`}>{hotel.name}</Link>
                            </h3>
                            <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-3">
                              <FaMapMarkerAlt className="text-primary-500" size={12} />
                              {hotel.location || hotel.city}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {(hotel.amenities?.slice(0, 4) || []).map((a, i) => {
                                const amenity = amenitiesList.find(am => am.key === a)
                                return amenity ? (
                                  <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                    <amenity.icon size={10} />
                                    {amenity.label}
                                  </span>
                                ) : null
                              })}
                              {(hotel.amenities?.length || 0) > 4 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs text-gray-500 dark:text-gray-400">
                                  +{hotel.amenities.length - 4}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                              <div>
                                <span className="text-2xl font-bold gradient-text">{formatCurrency(hotel.price)}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/ night</span>
                              </div>
                              <Link to={`/hotels/${hotel.slug}`} className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300">
                                View Deals
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                      className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                      <FaChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i + 1} onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                          currentPage === i + 1
                            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                            : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
                      <FaChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
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
    </motion.div>
  )
}
