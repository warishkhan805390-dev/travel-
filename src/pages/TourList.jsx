import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
  FaFilter, FaSearch, FaStar, FaClock, FaUserFriends,
  FaMapMarkerAlt, FaHeart, FaShare, FaSort, FaChevronLeft, FaChevronRight,
  FaTimes, FaEye
} from 'react-icons/fa'
import { formatCurrency, calculateDiscount, getImageUrl } from '../utils/helpers'
import Loader from '../components/common/Loader'
import { useWishlist } from '../context/WishlistContext'
import toast from 'react-hot-toast'

const categories = ['Adventure', 'Honeymoon', 'Family', 'Group', 'Luxury', 'Budget', 'Beach', 'Hill Station']
const destinations = ['India', 'Dubai', 'Thailand', 'Maldives', 'Singapore', 'Bali', 'Turkey', 'Europe', 'Switzerland', 'Paris', 'Japan', 'Nepal']
const durations = ['1-3 Days', '4-7 Days', '8-14 Days', '15+ Days']
const ratings = [5, 4, 3, 2, 1]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function TourList() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const toursPerPage = 9

  const [filters, setFilters] = useState({
    destination: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    duration: '',
    rating: 0,
  })

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()

  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/tours')
      setTours(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tours')
    } finally {
      setLoading(false)
    }
  }

  const filteredTours = tours.filter((tour) => {
    const matchesSearch = tour.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.location?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDestination = !filters.destination || tour.destination === filters.destination || tour.location === filters.destination
    const matchesCategory = !filters.category || tour.category === filters.category
    const matchesPrice = (tour.discountPrice || tour.price) >= filters.minPrice && (tour.discountPrice || tour.price) <= filters.maxPrice
    const matchesDuration = !filters.duration || matchDuration(tour.duration, filters.duration)
    const matchesRating = !filters.rating || (tour.rating || 0) >= filters.rating
    return matchesSearch && matchesDestination && matchesCategory && matchesPrice && matchesDuration && matchesRating
  })

  const matchDuration = (tourDuration, filterDuration) => {
    if (!tourDuration) return false
    const days = parseInt(tourDuration)
    if (filterDuration === '1-3 Days') return days >= 1 && days <= 3
    if (filterDuration === '4-7 Days') return days >= 4 && days <= 7
    if (filterDuration === '8-14 Days') return days >= 8 && days <= 14
    if (filterDuration === '15+ Days') return days >= 15
    return false
  }

  const sortedTours = [...filteredTours].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return (a.discountPrice || a.price) - (b.discountPrice || b.price)
      case 'price-high': return (b.discountPrice || b.price) - (a.discountPrice || a.price)
      case 'rating': return (b.rating || 0) - (a.rating || 0)
      case 'duration': return (a.duration || 0) - (b.duration || 0)
      case 'newest': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      default: return 0
    }
  })

  const totalPages = Math.ceil(sortedTours.length / toursPerPage)
  const indexOfLastTour = currentPage * toursPerPage
  const indexOfFirstTour = indexOfLastTour - toursPerPage
  const currentTours = sortedTours.slice(indexOfFirstTour, indexOfLastTour)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setFilters({ destination: '', category: '', minPrice: 0, maxPrice: 10000, duration: '', rating: 0 })
    setSearchQuery('')
  }

  const handleShare = async (tour) => {
    if (navigator.share) {
      await navigator.share({ title: tour.title, url: `${window.location.origin}/tours/${tour.slug}` })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/tours/${tour.slug}`)
      toast.success('Link copied to clipboard!')
    }
  }

  const hasActiveFilters = filters.destination || filters.category || filters.minPrice > 0 || filters.maxPrice < 10000 || filters.duration || filters.rating

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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination</label>
        <select
          value={filters.destination}
          onChange={(e) => { setFilters(f => ({ ...f, destination: e.target.value })); setCurrentPage(1) }}
          className="input-field"
        >
          <option value="">All Destinations</option>
          {destinations.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setFilters(f => ({ ...f, category: f.category === cat ? '' : cat })); setCurrentPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                filters.category === cat
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Price Range: ${filters.minPrice} - ${filters.maxPrice}
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={10000}
            value={filters.minPrice}
            onChange={(e) => { setFilters(f => ({ ...f, minPrice: Number(e.target.value) })); setCurrentPage(1) }}
            className="w-full accent-primary-500"
          />
          <input
            type="range"
            min={0}
            max={10000}
            value={filters.maxPrice}
            onChange={(e) => { setFilters(f => ({ ...f, maxPrice: Number(e.target.value) })); setCurrentPage(1) }}
            className="w-full accent-primary-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
        <select
          value={filters.duration}
          onChange={(e) => { setFilters(f => ({ ...f, duration: e.target.value })); setCurrentPage(1) }}
          className="input-field"
        >
          <option value="">Any Duration</option>
          {durations.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Rating</label>
        <div className="flex gap-2">
          {ratings.map(r => (
            <button
              key={r}
              onClick={() => { setFilters(f => ({ ...f, rating: f.rating === r ? 0 : r })); setCurrentPage(1) }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                filters.rating === r
                  ? 'bg-amber-400 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <FaStar className={filters.rating === r ? 'text-white' : 'text-amber-400'} size={12} />
              {r}+
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Oops!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button onClick={fetchTours} className="btn-primary">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Banner */}
      <section className="relative h-72 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Explore Tour Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg max-w-xl mx-auto"
          >
            Discover amazing destinations with our curated tour packages
          </motion.p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Sort Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tours by title, destination..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              className="input-field pl-12"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <FaSort className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="duration">Duration</option>
              </select>
            </div>
            <button
              onClick={() => setShowMobileFilter(true)}
              className="lg:hidden px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300"
            >
              <FaFilter />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 glass-card p-6">
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Loader key={i} type="card" />
                ))}
              </div>
            ) : currentTours.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Tours Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing <span className="font-semibold text-gray-900 dark:text-white">{indexOfFirstTour + 1}-{Math.min(indexOfLastTour, sortedTours.length)}</span> of{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">{sortedTours.length}</span> tours
                  </p>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {currentTours.map((tour) => {
                      const discount = calculateDiscount(tour.price, tour.discountPrice)
                      const inWishlist = isInWishlist(tour._id)
                      return (
                        <motion.div
                          key={tour._id}
                          layout
                          variants={cardVariants}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
                        >
                          <div className="relative overflow-hidden h-52">
                            <img
                              src={getImageUrl(tour.images?.[0] || tour.image)}
                              alt={tour.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                              <button
                                onClick={() => inWishlist ? removeFromWishlist(tour._id) : addToWishlist(tour)}
                                className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                                  inWishlist ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                                }`}
                              >
                                <FaHeart />
                              </button>
                              <button
                                onClick={() => handleShare(tour)}
                                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-primary-500 hover:text-white transition-all duration-300 hover:scale-110"
                              >
                                <FaShare />
                              </button>
                              <Link
                                to={`/tours/${tour.slug}`}
                                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:bg-primary-500 hover:text-white transition-all duration-300 hover:scale-110"
                              >
                                <FaEye />
                              </Link>
                            </div>
                            {tour.category && (
                              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold shadow-lg">
                                {tour.category}
                              </span>
                            )}
                            {discount > 0 && (
                              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold shadow-lg">
                                {discount}% OFF
                              </span>
                            )}
                          </div>
                          <div className="p-5">
                            <div className="flex items-center gap-1 text-amber-400 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <FaStar key={i} size={14} className={i < Math.round(tour.rating || 0) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'} />
                              ))}
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({tour.reviewCount || 0})</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors duration-300">
                              <Link to={`/tours/${tour.slug}`}>{tour.title}</Link>
                            </h3>
                            {tour.location && (
                              <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <FaMapMarkerAlt className="text-primary-500" size={12} />
                                {tour.location}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                              {tour.duration && (
                                <span className="flex items-center gap-1">
                                  <FaClock className="text-accent-500" size={12} />
                                  {tour.duration}
                                </span>
                              )}
                              {tour.groupSize && (
                                <span className="flex items-center gap-1">
                                  <FaUserFriends className="text-accent-500" size={12} />
                                  Up to {tour.groupSize}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                              <div>
                                <span className="text-2xl font-bold gradient-text">
                                  {formatCurrency(tour.discountPrice || tour.price)}
                                </span>
                                {tour.discountPrice && (
                                  <span className="text-sm text-gray-400 line-through ml-2">
                                    {formatCurrency(tour.price)}
                                  </span>
                                )}
                                <span className="block text-xs text-gray-500 dark:text-gray-400">per person</span>
                              </div>
                              <Link to={`/tours/${tour.slug}`} className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300">
                                View Details
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <FaChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                          currentPage === i + 1
                            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                            : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilter(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
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
