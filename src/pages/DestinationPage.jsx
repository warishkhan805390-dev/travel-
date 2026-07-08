import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import {
  FaMapMarkerAlt, FaStar, FaSun, FaUmbrellaBeach, FaMountain,
  FaClock, FaUserFriends, FaFilter, FaTimes, FaHotel, FaCompass,
  FaCalendarAlt, FaChevronRight
} from 'react-icons/fa'
import { formatCurrency, formatDate, getImageUrl } from '../utils/helpers'

const placeholderDestination = {
  name: 'Bali',
  description: 'Bali is a paradise island known for its volcanic mountains, rice terraces, beaches, and coral reefs. It offers a unique blend of natural beauty, culture, and modern tourism amenities.',
  image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920',
  bestTimeToVisit: 'April to October (Dry Season)',
  popularAttractions: ['Ubud Monkey Forest', 'Tegallalang Rice Terrace', 'Tanah Lot Temple', 'Seminyak Beach', 'Uluwatu Temple', 'Mount Batur'],
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function DestinationPage() {
  const { name } = useParams()
  const [activeTab, setActiveTab] = useState('tours')
  const [tours, setTours] = useState([])
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [tourFilters, setTourFilters] = useState({ category: '', minPrice: 0, maxPrice: 10000 })
  const [hotelFilters, setHotelFilters] = useState({ stars: 0, minPrice: 0, maxPrice: 10000 })

  const capitalised = name?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Destination'
  const destination = { ...placeholderDestination, name: capitalised }

  useEffect(() => {
    fetchDestinationData()
  }, [name])

  const fetchDestinationData = async () => {
    try {
      setLoading(true)
      const [toursRes, hotelsRes] = await Promise.allSettled([
        axios.get(`/api/tours?destination=${capitalised}`),
        axios.get(`/api/hotels?destination=${capitalised}`),
      ])

      const toursData = toursRes.status === 'fulfilled'
        ? (Array.isArray(toursRes.value.data) ? toursRes.value.data : toursRes.value.data.data || [])
        : []
      const hotelsData = hotelsRes.status === 'fulfilled'
        ? (Array.isArray(hotelsRes.value.data) ? hotelsRes.value.data : hotelsRes.value.data.data || [])
        : []

      setTours(toursData)
      setHotels(hotelsData)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load destination data')
    } finally {
      setLoading(false)
    }
  }

  const filteredTours = tours.filter(t => {
    const matchCategory = !tourFilters.category || t.category === tourFilters.category
    const matchPrice = (t.discountPrice || t.price) >= tourFilters.minPrice && (t.discountPrice || t.price) <= tourFilters.maxPrice
    return matchCategory && matchPrice
  })

  const filteredHotels = hotels.filter(h => {
    const matchStars = !hotelFilters.stars || h.stars >= hotelFilters.stars
    const matchPrice = h.price >= hotelFilters.minPrice && h.price <= hotelFilters.maxPrice
    return matchStars && matchPrice
  })

  const TourCard = ({ tour }) => (
    <motion.div variants={cardVariants} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
      <Link to={`/tours/${tour.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img src={getImageUrl(tour.images?.[0] || tour.image)} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {tour.category && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-semibold shadow-lg">{tour.category}</span>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-1 text-amber-400 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} size={13} className={i < Math.round(tour.rating || 0) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'} />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({tour.reviewCount || 0})</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">{tour.title}</h3>
          {tour.location && (
            <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <FaMapMarkerAlt className="text-primary-500" size={10} /> {tour.location}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
            {tour.duration && <span className="flex items-center gap-1"><FaClock className="text-accent-500" size={10} />{tour.duration}</span>}
            {tour.groupSize && <span className="flex items-center gap-1"><FaUserFriends className="text-accent-500" size={10} />Up to {tour.groupSize}</span>}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              <span className="text-xl font-bold gradient-text">{formatCurrency(tour.discountPrice || tour.price)}</span>
              {tour.discountPrice && <span className="text-xs text-gray-400 line-through ml-2">{formatCurrency(tour.price)}</span>}
              <span className="block text-xs text-gray-500 dark:text-gray-400">per person</span>
            </div>
            <span className="text-primary-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View <FaChevronRight size={10} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )

  const HotelCard = ({ hotel }) => (
    <motion.div variants={cardVariants} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
      <Link to={`/hotels/${hotel.slug}`}>
        <div className="relative h-48 overflow-hidden">
          <img src={getImageUrl(hotel.images?.[0] || hotel.image)} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-amber-500 text-xs font-semibold shadow-lg">
            <FaStar /> {hotel.stars || 4}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">{hotel.name}</h3>
          {hotel.location && (
            <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <FaMapMarkerAlt className="text-primary-500" size={10} /> {hotel.location}
            </p>
          )}
          <div className="flex items-center gap-1 text-amber-400 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} size={12} className={i < Math.round(hotel.rating || 0) ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'} />
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({hotel.reviewCount || 0})</span>
          </div>
          {hotel.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {hotel.amenities.slice(0, 3).map((a, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">{a}</span>
              ))}
              {hotel.amenities.length > 3 && (
                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">+{hotel.amenities.length - 3}</span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
            <div>
              <span className="text-xl font-bold gradient-text">{formatCurrency(hotel.discountPrice || hotel.price)}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">per night</span>
            </div>
            <span className="text-primary-500 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              View <FaChevronRight size={10} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button onClick={fetchDestinationData} className="btn-primary">Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end justify-center overflow-hidden">
        <img src={destination.image} alt={destination.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <FaMapMarkerAlt />
              <span className="text-sm font-medium uppercase tracking-wider">Destination</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-3">{destination.name}</h1>
            <p className="text-lg text-gray-200 max-w-2xl">{destination.description?.substring(0, 150)}...</p>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/tours" className="text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors">Destinations</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium">{destination.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Destination Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20">
              <FaSun className="text-2xl text-primary-500 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Best Time to Visit</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{destination.bestTimeToVisit}</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-accent-500/10 to-primary-500/10 border border-accent-500/20">
              <FaUmbrellaBeach className="text-2xl text-accent-500 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Popular Attractions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{destination.popularAttractions.slice(0, 3).join(', ')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <FaMountain className="text-2xl text-emerald-500 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Weather</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tropical climate with warm temperatures year-round</p>
            </div>
          </div>
          {/* Attractions List */}
          <div className="mt-6 p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FaCompass className="text-primary-500" /> Popular Attractions
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
              {destination.popularAttractions.map((attr, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FaChevronRight className="text-primary-500" size={10} />
                  {attr}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl w-fit mb-8">
          <button
            onClick={() => setActiveTab('tours')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'tours'
                ? 'bg-white dark:bg-gray-700 text-primary-500 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FaMapMarkerAlt /> Tours
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === 'hotels'
                ? 'bg-white dark:bg-gray-700 text-primary-500 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FaHotel /> Hotels
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'tours' && (
            <motion.div key="tours" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                      <div className="p-5 space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredTours.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Tours Available</h3>
                  <p className="text-gray-500 dark:text-gray-400">No tours available for this destination yet</p>
                </motion.div>
              ) : (
                <>
                  {/* Tour Filters */}
                  <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <FaFilter className="text-gray-400" />
                      <select value={tourFilters.category} onChange={(e) => setTourFilters(f => ({ ...f, category: e.target.value }))}
                        className="input-field text-sm py-2">
                        <option value="">All Categories</option>
                        {['Adventure', 'Honeymoon', 'Family', 'Group', 'Luxury', 'Budget', 'Beach', 'Hill Station'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Price:</span>
                      <select value={tourFilters.maxPrice} onChange={(e) => setTourFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                        className="input-field text-sm py-2">
                        <option value={10000}>All Prices</option>
                        <option value={500}>Under $500</option>
                        <option value={1000}>Under $1,000</option>
                        <option value={2000}>Under $2,000</option>
                        <option value={5000}>Under $5,000</option>
                      </select>
                    </div>
                  </div>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {filteredTours.map(tour => <TourCard key={tour._id} tour={tour} />)}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'hotels' && (
            <motion.div key="hotels" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
                      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                      <div className="p-5 space-y-3">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredHotels.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <FaHotel className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Hotels Available</h3>
                  <p className="text-gray-500 dark:text-gray-400">No hotels available for this destination yet</p>
                </motion.div>
              ) : (
                <>
                  {/* Hotel Filters */}
                  <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <FaStar className="text-amber-400" />
                      <select value={hotelFilters.stars} onChange={(e) => setHotelFilters(f => ({ ...f, stars: Number(e.target.value) }))}
                        className="input-field text-sm py-2">
                        <option value={0}>Any Stars</option>
                        {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} Star</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Price:</span>
                      <select value={hotelFilters.maxPrice} onChange={(e) => setHotelFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                        className="input-field text-sm py-2">
                        <option value={10000}>All Prices</option>
                        <option value={100}>Under $100</option>
                        <option value={200}>Under $200</option>
                        <option value={500}>Under $500</option>
                        <option value={1000}>Under $1,000</option>
                      </select>
                    </div>
                  </div>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {filteredHotels.map(hotel => <HotelCard key={hotel._id} hotel={hotel} />)}
                    </AnimatePresence>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
